"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    const data = {
      address: getValue("address"),
      city: getValue("city"),
      state: getValue("state"),
      zip: getValue("zip"),
      price: Number(getValue("price")),
      bedrooms: getValue("bedrooms") ? Number(getValue("bedrooms")) : null,
      bathrooms: getValue("bathrooms") ? Number(getValue("bathrooms")) : null,
      sqft: getValue("sqft") ? Number(getValue("sqft")) : null,
      description: getValue("description"),
    };

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/listings");
    } else {
      const err = await res.json();
      setError(err.error ?? "Failed to create listing");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Listing</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <input name="address" required className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" required className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input name="state" required maxLength={2} placeholder="TX" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
            <input name="zip" required className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input name="price" type="number" required min={0} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input name="bedrooms" type="number" min={0} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input name="bathrooms" type="number" min={0} step={0.5} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sq Ft</label>
            <input name="sqft" type="number" min={0} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={4} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Listing"}
          </button>
          <button type="button" onClick={() => router.back()} className="border text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
