import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CITIES, REGIONS, findCity } from "./kz.ts";
import { isSafePhoto } from "../photos.ts";

describe("kazakhstan places", () => {
  it("covers every region and keeps city ids unique", () => {
    const ids = new Set(CITIES.map((c) => c.id));
    assert.equal(ids.size, CITIES.length);
    for (const region of REGIONS) {
      assert.ok(CITIES.some((c) => c.region === region.id), region.id);
    }
  });

  it("matches the 2025 city-district counts for the three big cities", () => {
    assert.equal(findCity("Almaty")?.districts.length, 8);
    assert.equal(findCity("Astana")?.districts.length, 6);
    assert.equal(findCity("Shymkent")?.districts.length, 5);
    assert.ok(findCity("Astana")?.districts.some((d) => d.id === "Sarayshyk"));
    assert.ok(findCity("Karaganda")?.districts.some((d) => d.id === "Bokeikhan"));
    assert.ok(findCity("Alatau"));
  });

  it("gives every city coordinates inside Kazakhstan", () => {
    for (const city of CITIES) {
      assert.ok(city.lat > 40 && city.lat < 56, city.id);
      assert.ok(city.lng > 46 && city.lng < 88, city.id);
      assert.ok(city.districts.length >= 1, city.id);
    }
  });

  it("accepts only jpeg data urls and https photos", () => {
    assert.equal(isSafePhoto("https://images.unsplash.com/photo.jpg"), true);
    assert.equal(isSafePhoto("data:image/jpeg;base64,aaaa"), true);
    assert.equal(isSafePhoto("data:text/html;base64,aaaa"), false);
    assert.equal(isSafePhoto("javascript:alert(1)"), false);
  });
});
