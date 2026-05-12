import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/sanity", () => ({
  sanityWriteClient: {
    create: vi.fn(),
  },
}));

import { POST } from "../route";
import { sanityWriteClient } from "@/lib/sanity";

function makeRequest(
  body: unknown,
  referer = "https://example.com/answers"
): Request {
  return new Request("http://localhost/api/submit-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: referer,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/submit-question", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("silently accepts honeypot-triggered bot submissions without writing to Sanity", async () => {
    const req = makeRequest({
      email: "bot@example.com",
      question: "I am a bot trying to spam",
      _website: "filled by bot",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(sanityWriteClient.create).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const req = makeRequest({
      email: "not-an-email",
      question: "A valid question of sufficient length",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects a question that is too short", async () => {
    const req = makeRequest({
      email: "user@example.com",
      question: "short",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects a name longer than 100 characters", async () => {
    const req = makeRequest({
      email: "user@example.com",
      question: "Valid question with enough length here please",
      name: "a".repeat(101),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates a submittedQuestion with correct fields on valid input", async () => {
    (sanityWriteClient.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      _id: "abc123",
    });
    const req = makeRequest({
      name: "Joe",
      email: "joe@example.com",
      question:
        "How long does the AEWV process take from the Philippines for a nurse?",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(sanityWriteClient.create).toHaveBeenCalledTimes(1);
    const arg = (sanityWriteClient.create as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(arg._type).toBe("submittedQuestion");
    expect(arg.submitterEmail).toBe("joe@example.com");
    expect(arg.submitterName).toBe("Joe");
    expect(arg.question).toBe(
      "How long does the AEWV process take from the Philippines for a nurse?"
    );
    expect(arg.sourceUrl).toBe("https://example.com/answers");
    expect(arg.status).toBe("new");
    expect(typeof arg.submittedAt).toBe("string");
  });

  it("returns 500 if Sanity write throws", async () => {
    (sanityWriteClient.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("network down")
    );
    const req = makeRequest({
      email: "user@example.com",
      question: "Valid question with enough length here please",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });
});
