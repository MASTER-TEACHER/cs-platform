import type {
  AssistantApiResponse,
  SendAssistantMessageInput,
} from "@/types/assistant";

export async function sendAssistantMessage({
  message,
  mode,
  conversation,
  useDemo = false,
}: SendAssistantMessageInput): Promise<AssistantApiResponse> {
  const cleanedMessage = message.trim();

  if (!cleanedMessage) {
    throw new Error("Enter a message for the assistant.");
  }

  const response = await fetch("/api/ai/chat", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message: cleanedMessage,
      mode,
      conversation,
      useDemo,
    }),
  });

  let data: AssistantApiResponse;

  try {
    data = (await response.json()) as AssistantApiResponse;
  } catch {
    throw new Error("The assistant returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "The assistant could not respond.");
  }

  if (!data.message) {
    throw new Error("The assistant did not return a message.");
  }

  return data;
}
