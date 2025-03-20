import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NumbersDisplay } from "@/components/numbers-display"
import { AverageCalculator } from "@/components/average-calculator"
import { TestCase } from "@/components/test-case"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white dark:bg-slate-950">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Numbers API Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Average Calculator HTTP Microservice</p>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="calculator">Average Calculator</TabsTrigger>
            <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
            <TabsTrigger value="even">Even</TabsTrigger>
            <TabsTrigger value="random">Random</TabsTrigger>
            <TabsTrigger value="test-case">Test Case</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <AverageCalculator />
          </TabsContent>

          <TabsContent value="fibonacci">
            <NumbersDisplay
              title="Fibonacci Numbers API"
              description="Sequence where each number is the sum of the two preceding ones"
              endpoint="/api/numbers/fibonacci"
              apiUrl="http://20.244.56.144/test/fibo"
              type="f"
            />
          </TabsContent>

          <TabsContent value="even">
            <NumbersDisplay
              title="Even Numbers API"
              description="Sequence of numbers that are divisible by 2"
              endpoint="/api/numbers/even"
              apiUrl="http://20.244.56.144/test/fibo"
              type="e"
            />
          </TabsContent>

          <TabsContent value="random">
            <NumbersDisplay
              title="Random Numbers API"
              description="Sequence of randomly generated numbers"
              endpoint="/api/numbers/random"
              apiUrl="http://20.244.56.144/test/rand"
              type="r"
            />
          </TabsContent>

          <TabsContent value="test-case">
            <TestCase />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white dark:bg-slate-950 py-6">
        <div className="container mx-auto">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>Afford Medical Technologies Private Limited</p>
            <p className="text-xs mt-1">B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

