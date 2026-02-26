You are building a:

> **Server → client lifecycle signal bridge**

The server is **only emitting timing/state events**, while **TWILA logic (raycasting, overlays, UI decisions)** stays entirely client-side.

So let’s correct the model properly.

---

# ✅ Correct Mental Model

## What TWILA needs

NOT:

```
Server computes gameplay → sends results
```

BUT:

```
Server lifecycle happens
        ↓
Server emits signal
        ↓
Client receives signal
        ↓
JS runtime reacts locally
        ↓
Client raycasts + renders overlay
```

The server is just a **clock + authority notifier**.

---

# 🧠 Why You Still Need a Server Event

Even though raycasting is client-side, the client still needs server-derived signals like:

* server tick
* world tick phase
* dimension sync moments
* authoritative timing
* multiplayer consistency

Because:

👉 client tick ≠ server tick.

They drift and are not authoritative.

---

# 🏗 Proper Architecture (Revised)

You only need **three layers**, not the watcher registry I described earlier.

```
Server Tick Hook
      ↓
Broadcast Event Packet
      ↓
Client Event Dispatcher
      ↓
Graal → JS callback
```

No subscriptions required (unless you want optimization later).

---

# 1️⃣ Server Tick Hook (Fabric)

Fabric already exposes this.

Use:

```
ServerTickEvents.END_SERVER_TICK
```

---

## Server Implementation

```java
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;

public final class TapestryServerEvents {

    public static void init() {
        ServerTickEvents.END_SERVER_TICK.register(server -> {
            emitServerTick(server);
        });
    }
}
```

---

# 2️⃣ Emit Server Tick Packet

You send a **very small signal packet**.

You are NOT sending gameplay data.

Just:

```
"server tick occurred"
```

---

## Packet Identifier

```java
public static final Identifier SERVER_TICK =
    new Identifier("tapestry", "server_tick");
```

---

## Emit Function

```java
private static void emitServerTick(MinecraftServer server) {

    PacketByteBuf buf = PacketByteBufs.create();

    buf.writeLong(server.getTicks());

    for (ServerPlayerEntity player :
            PlayerLookup.all(server)) {

        ServerPlayNetworking.send(player, SERVER_TICK, buf);
    }
}
```

✔ minimal
✔ deterministic
✔ cheap

---

### Why send tick number?

Because now JS can detect:

* skipped ticks
* lag
* sync drift

Very useful later.

---

# 3️⃣ Client Packet Receiver

Register once during client init.

```java
ClientPlayNetworking.registerGlobalReceiver(
    SERVER_TICK,
    (client, handler, buf, sender) -> {

        long tick = buf.readLong();

        client.execute(() -> {
            ClientEventBus.emitServerTick(tick);
        });
    }
);
```

Important:

```
client.execute(...)
```

ensures main-thread safety.

---

# 4️⃣ Client Event Bus (Tiny Version)

You do NOT need subscriptions per player.

Just local listeners.

```java
public final class ClientEventBus {

    private static final List<LongConsumer> serverTickListeners =
        new ArrayList<>();

    public static void onServerTick(LongConsumer listener) {
        serverTickListeners.add(listener);
    }

    public static void emitServerTick(long tick) {
        for (var l : serverTickListeners) {
            l.accept(tick);
        }
    }
}
```

---

# 5️⃣ Graal Bridge

Expose to JS:

```java
public void watchServerTick(Value callback) {
    ClientEventBus.onServerTick(tick ->
        callback.execute(tick)
    );
}
```

Expose as:

```
tapestry.events.onServerTick(fn)
```

---

# 6️⃣ TWILA JS Usage

Now TWILA does the raycasting locally:

```ts
tapestry.events.onServerTick((tick) => {
    const hit = client.raycast();

    if (hit) {
        overlay.show(hit.block);
    }
});
```

Server does **zero gameplay work**.

Exactly what you want.

---

# 🔥 Why This Is Architecturally Correct

You now have:

| Responsibility    | Location   |
| ----------------- | ---------- |
| Authority timing  | Server     |
| Gameplay querying | Client     |
| Rendering         | Client     |
| Mod logic         | JS runtime |

This matches Minecraft’s real model:

* server = truth
* client = perception

---

# ⚠️ Extremely Important Optimization Insight

You may later realize:

> Sending a packet every server tick sounds expensive.

But:

* 20 packets/sec/player
* payload ≈ 8 bytes

That is **tiny** (~160 bytes/sec).

Minecraft already sends far more.

So this is safe.

---

# ✅ Final Architecture Summary

```
Fabric Server Tick Event
        ↓
Tapestry Server Bridge
        ↓
Network Packet (tick id)
        ↓
Client Dispatcher
        ↓
Graal Bridge
        ↓
TWILA JS watcher
        ↓
Client raycast + overlay
```