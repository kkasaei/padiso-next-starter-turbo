import { task } from "@trigger.dev/sdk/v3";

export const exampleTask = task({
  id: "example-task",
  run: async (payload: { message: string }) => {
    console.log("Running example task with:", payload.message);
    
    // Your task logic here
    // await someAsyncOperation();
    
    return {
      success: true,
      message: payload.message,
      timestamp: new Date().toISOString(),
    };
  },
});
