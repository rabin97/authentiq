import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Hello</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Testing</p>
      </div>
    </main>
  );
}
