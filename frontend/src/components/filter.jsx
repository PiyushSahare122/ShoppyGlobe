import { Fragment } from "react"; 
import { Label } from "./ui/label"; 
import { Checkbox } from "./ui/checkbox"; 
import { Separator } from "./ui/separator"; 

// Defining filter options for product categories and brands
const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
  ],
  brand: [
    { id: "Roadster", label: "Roadster" },
    { id: "Manyavar", label: "Manyavar" },
    { id: "INVICTUS", label: "INVICTUS" },
    { id: "KALINI", label: "KALINI" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

// ProductFilter component to display and manage product filters
function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm"> 
      <div className="p-4 border-b"> 
        <h2 className="text-lg font-extrabold">Filters</h2> 
      </div>
      <div className="p-4 space-y-4"> 
        {/* Loop through filter options keys (categories and brands) */}
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3> 
              <div className="grid gap-2 mt-2"> 
                {/* Loop through each filter option */}
                {filterOptions[keyItem].map((option) => (
                  <Label className="flex font-medium items-center gap-2" key={option.id}> 
                    <Checkbox
                      checked={ 
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)} 
                    />
                    {option.label} 
                  </Label>
                ))}
              </div>
            </div>
            <Separator /> 
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter; 
