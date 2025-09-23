// Import Select UI components from shadcn/ui (or your UI library)
// These provide the dropdown structure and styling
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Reusable Dropdown Field Component
// - `item`   → object containing label, name, options etc.
// - `formData` → state object holding current form values
// - `handleInputChange` → function to update parent state when selection changes
function DropDownField({ item, formData, handleInputChange }) {
  return (
    <div className="w-[100%]">
      {/* 
        Main Select component
        - `value` sets the currently selected option (from formData)
        - `onValueChange` is triggered when user selects a new option
        - Here we call parent's handleInputChange to keep form state updated
      */}
      <Select
        value={formData?.[item.name] || ""} 
        onValueChange={(val) => handleInputChange(item.name, val)}
      >
        {/* 
          SelectTrigger = the clickable box that opens the dropdown
          - `className="w-full"` makes it full width
        */}
        <SelectTrigger className="w-full">
          {/* 
            SelectValue = shows the current selected value inside the trigger
            - `placeholder` shown if no value is selected yet
          */}
          <SelectValue placeholder={`Select ${item.label}`} />
        </SelectTrigger>

        {/* 
          SelectContent = the dropdown menu that appears on click
          - Maps through item.options to create SelectItem for each option
        */}
        <SelectContent>
          {item.options?.map((opt, index) => (
            <SelectItem key={index} value={opt}>
              {opt} {/* Text displayed for each option */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropDownField;
