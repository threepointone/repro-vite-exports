import { DurableObject, env, WorkerEntrypoint } from "cloudflare:workers";

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

export default {
  async fetch(request: Request) {
    const simpleDOStub = env.MY_SIMPLE_DURABLE_OBJECT.getByName(
      "my-simple-durable-object"
    );

    const simpleDOResponse = await simpleDOStub.fetch(request);
    console.log("Simple DO Response:", await simpleDOResponse.text());

    const extendedDOStub = env.MY_EXTENDED_DURABLE_OBJECT.getByName(
      "my-extended-durable-object"
    );

    const extendedDOResponse = await extendedDOStub.fetch(request);
    console.log("Extended DO Response:", await extendedDOResponse.text());

    const simpleWorkerEntrypointResponse = await env.MY_SIMPLE_ENTRYPOINT.fetch(
      request
    );
    console.log(
      "Simple Worker Entrypoint Response:",
      await simpleWorkerEntrypointResponse.text()
    );

    const extendedWorkerEntrypointResponse =
      await env.MY_EXTENDED_ENTRYPOINT.fetch(request);
    console.log(
      "Extended Worker Entrypoint Response:",
      await extendedWorkerEntrypointResponse.text()
    );

    return new Response("Hello, world! This is the default export.");
  },
} satisfies ExportedHandler<Env>;
