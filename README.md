repro-vite-exports

---

This is a reproduction of a bug with the vite plugin.

You should be allowed to define durable objects and worker entry points as simple classes, as well as by extending the classes exported by the `cloudflare:workers` package.

These are all valid:

```ts
// simple DO export

export class MySimpleDurableObject {
  fetch(request: Request) {
    return new Response("Hello, world! This is a simple durable object.");
  }
}

// extended DO export

export class MyExtendedDurableObject extends DurableObject {
  fetch(request: Request) {
    return new Response("Hello, world! This is an extended durable object.");
  }
}

// simple worker entrypoint export

export const SimpleWorkerEntrypoint = {
  fetch: (request: Request) => {
    return new Response("Hello, world! This is a simple worker entrypoint.");
  },
};

// extended worker entrypoint export

export class ExtendedWorkerEntrypoint extends WorkerEntrypoint {
  fetch(request: Request) {
    return new Response("Hello, world! This is an extended worker entrypoint.");
  }
}
```

I have a repro here that defines both types in `wrangler.jsonc` and has a worker that actually implements them and uses them. When you run this with `wrangler dev`, you'll see that it works just fine with the expected output. However, when you run it with `vite dev`, you'll see that it fails at the configuration stage with an error message.

```
A DurableObjectNamespace in the config referenced the class "MySimpleDurableObject", but no such Durable Object class is exported from the worker. Please make sure the class name matches, it is exported, and the class extends 'DurableObject'. Attempts to call to this Durable Object class will fail at runtime, but historically this was not a startup-time error. Future versions of workerd may make this a startup-time error.
Worker "core:user:repro-vite-exports"'s binding "MY_SIMPLE_ENTRYPOINT" refers to service "core:user:repro-vite-exports" with a named entrypoint "SimpleWorkerEntrypoint", but "core:user:repro-vite-exports" has no such named entrypoint.
```

I'm pretty sure this is a regression in the vite plugin. I have older workers that used to work that now fail on updating.
