/**
 * Example usage of TanStack Query and TanStack Form
 * 
 * This file demonstrates how to use both libraries in your components
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { FieldApi } from "@tanstack/react-form";

// ============================================
// TanStack Query Examples
// ============================================

// Example: Fetching data with useQuery
export function ExampleQueryComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render your data */}</div>;
}

// Example: Mutating data with useMutation
export function ExampleMutationComponent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { phone: string; address: string }) => {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ phone: "+63...", address: "..." })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Submitting..." : "Submit"}
    </button>
  );
}

// ============================================
// TanStack Form Examples
// ============================================

// Example: Basic form with TanStack Form
export function ExampleFormComponent() {
  const form = useForm({
    defaultValues: {
      phone: "",
      city: "",
      street_address: "",
    },
    onSubmit: async ({ value }) => {
      // Handle form submission
      console.log("Form submitted:", value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="phone"
        validators={{
          onChange: ({ value }) =>
            !value ? "Phone number is required" : undefined,
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            // Async validation example
            if (value && !/^\+63/.test(value)) {
              return "Phone number must start with +63";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name}>Phone Number</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <div>{field.state.meta.errors[0]}</div>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}

// Example: Combining TanStack Query with TanStack Form
export function ExampleCombinedComponent() {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      phone: "",
      city: "",
      street_address: "",
    },
    onSubmit: async ({ value }) => {
      // Use mutation from TanStack Query
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      const result = await response.json();
      
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      return result;
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Form fields */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
