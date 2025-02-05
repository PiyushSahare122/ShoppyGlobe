import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import ShoppingOrders from "@/components/orders"; 

// Functional component for the ShoppingAccount
function ShoppingAccount() {
  return (
    <div className="flex flex-col"> 
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8"> 
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm"> 
          <Tabs defaultValue="orders"> 
            <TabsList> 
              <TabsTrigger value="orders">Orders</TabsTrigger> 
            </TabsList>
            <TabsContent value="orders"> 
              <ShoppingOrders /> 
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount; 
