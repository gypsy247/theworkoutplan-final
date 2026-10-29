import { describe, expect, it } from "vitest";
import { BOOKING_RULES, TIERS } from "@/components/site/data";

describe("Private studio services", () => {
  it("offers only the four requested one-on-one tiers", () => {
    expect(TIERS.map((tier) => tier.id)).toEqual(["izzy", "analine", "dev", "virtual"]);
  });
  it.each([["izzy", 170], ["analine", 115], ["dev", 95], ["virtual", 150]])("prices %s at $%s", (id, price) => {
    expect(TIERS.find((tier) => tier.id === id)?.price).toBe(price);
  });
  it("sessions last one hour", () => expect(BOOKING_RULES.sessionMinutes).toBe(60));
  it("requires 48 hours to reschedule", () => expect(BOOKING_RULES.rescheduleHours).toBe(48));
  it("charges arrivals at 15 minutes late in full", () => expect(BOOKING_RULES.noShowMinutes).toBe(15));
  it("can shorten sessions at 10 minutes late", () => expect(BOOKING_RULES.shortenedSessionMinutes).toBe(10));
  it("does not allow refunds", () => expect(BOOKING_RULES.refundsAllowed).toBe(false));
});