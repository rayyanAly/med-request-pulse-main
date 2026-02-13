/**
 * Template Parameter Fallbacks
 * Provides default values when users don't enter parameters
 * 
 * Example Usage:
 * Template: "Hello {{name}}, your order {{order_id}} for {{amount}} is ready!"
 * 
 * If user enters:
 * - name: "John" → "Hello John, your order Your Order for Amount is ready!"
 * - (leaves name empty) → "Hello Customer, your order Your Order for Amount is ready!"
 * 
 * Supported parameter patterns:
 * - {{name}}, {{customer_name}} → "Customer"
 * - {{phone}}, {{number}} → "Customer" 
 * - {{order}}, {{order_id}} → """
 * "
 * - {{amount}}, {{price}} → "Amount"
 * - {{date}}, {{time}} → "Date"
 * - {{product}}, {{medicine}} → "Product"
 * - {{address}}, {{location}} → "Location"
 * - {{company}}, {{pharmacy}} → "800 Pharmacy"
 * - And many more...
 */

export interface ParameterFallback {
  pattern: RegExp;
  fallback: string;
  description: string;
}

// Define fallback mappings for common template parameters
export const PARAMETER_FALLBACKS: ParameterFallback[] = [
  // Name-related parameters (more flexible matching)
  {
    pattern: /(name|customer|client|user)/i,
    fallback: "Customer",
    description: "Customer name"
  },

  // Phone/Number-related parameters
  {
    pattern: /(phone|number|mobile|contact|tel|telephone)/i,
    fallback: "Customer",
    description: "Phone number"
  },

  // Order/Invoice-related parameters
  {
    pattern: /(order|invoice)/i,
    fallback: "Your Order",
    description: "Order/Invoice ID"
  },

  // Amount/Price-related parameters
  {
    pattern: /(amount|price|cost|total|sum|payment)/i,
    fallback: "Amount",
    description: "Amount/Price"
  },

  // Date/Time-related parameters
  {
    pattern: /(date|time|datetime|delivery|appointment)/i,
    fallback: "Date",
    description: "Date/Time"
  },

  // Product-related parameters
  {
    pattern: /(product|item|medicine|medication|drug)/i,
    fallback: "Product",
    description: "Product/Item"
  },

  // Location-related parameters
  {
    pattern: /(address|location|area|city|zone|delivery)/i,
    fallback: "Location",
    description: "Address/Location"
  },

  // Status-related parameters
  {
    pattern: /(status|state|condition|tracking)/i,
    fallback: "Status",
    description: "Status/State"
  },

  // Company/Store-related parameters
  {
    pattern: /(company|store|pharmacy|clinic|hospital)/i,
    fallback: "800 Pharmacy",
    description: "Company/Store name"
  },

  // URL/Link-related parameters
  {
    pattern: /(url|link|website|payment_link|tracking_link)/i,
    fallback: "https://www.800pharmacy.ae",
    description: "URL/Link"
  },

  // Order/Number-related parameters
  {
    pattern: /(no|number|order_no|order_number|id)/i,
    fallback: "Order Number",
    description: "Order/Number ID"
  },

  // Flow/Action-related parameters
  {
    pattern: /(flow|action|survey|feedback|rate|rating|feedback_survey)/i,
    fallback: "Rate Our Service",
    description: "Flow/Action"
  }
];

/**
 * Get fallback value for a parameter based on its name
 * @param parameterName - The name of the parameter (without curly braces)
 * @param userValue - The value entered by the user
 * @param customMapping - Optional custom mapping from template metadata
 * @returns The user value if provided, otherwise an appropriate fallback
 */
export function getParameterFallback(parameterName: string, userValue: string, customMapping?: Record<string, string>): string {
  // If user provided a value, use it
  if (userValue && userValue.trim()) {
    const trimmedValue = userValue.trim();

    // Special handling for payment_link: extract only the part after the last /
    if (/(payment_link)/i.test(parameterName.trim().toLowerCase())) {
      const urlMatch = trimmedValue.match(/\/([^\/]+)$/);
      if (urlMatch) {
        return urlMatch[1];
      }
    }

    return trimmedValue;
  }

  // Clean parameter name (remove spaces, convert to lowercase)
  const cleanName = parameterName.trim().toLowerCase();

  // Special handling for positional parameters
  if (/^\d+$/.test(cleanName)) {
    // Check custom mapping first (from input_map)
    if (customMapping && customMapping[parameterName]) {
      const mappingValue = customMapping[parameterName].toLowerCase().trim();
      switch (mappingValue) {
        case 'customer_name':
        case 'customer name':
          return "Customer";
        case 'agent_name':
        case 'agent name':
          return "Agent";
        case 'customer_phone':
        case 'customer phone':
          return "Customer";
        case 'first_name':
        case 'first name':
          return "Customer";
        case 'last_name':
        case 'last name':
          return "Customer";
        case 'date':
          return "Date";
        case 'time':
          return "Time";
        case 'company':
        case 'store':
          return "800 Pharmacy";
        case 'order_id':
        case 'order id':
          return "ID";
        case 'amount':
        case 'price':
          return "Amount";
        case 'product':
        case 'item':
          return "Product";
        case 'address':
        case 'location':
          return "Location";
        case 'status':
          return "Status";
        default:
          // Use the mapped name to find a fallback
          const fallback = PARAMETER_FALLBACKS.find(f => f.pattern.test(mappingValue));
          if (fallback) {
            return fallback.fallback;
          }
          return "Value";
      }
    }

    // Fallback to default positional logic if no custom mapping
    const position = parseInt(cleanName);
    switch (position) {
      case 1:
        return "Customer";
      case 2:
        return "Amount";
      case 3:
        return "Agent";
      case 4:
        return "Customer";
      case 5:
        return "Date";
      case 6:
        return "Your Order";
      case 7:
        return "Product";
      case 8:
        return "Location";
      case 9:
        return "Status";
      case 10:
        return "800 Pharmacy";
      default:
        return "Value";
    }
  }

  // Special handling for agent parameters
  if (cleanName.includes('agent')) {
    return "Agent";
  }

  // Find matching fallback
  const fallback = PARAMETER_FALLBACKS.find(f => f.pattern.test(cleanName));

  if (fallback) {
    return fallback.fallback;
  }

  // Default fallback for unknown parameters
  return "Value";
}

/**
 * Get all parameters from template content
 * @param content - Template content with {{parameter}} placeholders
 * @returns Array of parameter names without the curly braces
 */
export function extractParameterNames(content: string): string[] {
  const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
  const paramNames = matches.map(match => match.replace(/[{}]/g, '').trim());

  // For positional templates ({{1}}, {{2}}, etc.), sort by position
  const positionalParams = paramNames.filter(name => /^\d+$/.test(name));
  const namedParams = paramNames.filter(name => !/^\d+$/.test(name));

  // Sort positional parameters numerically and named parameters alphabetically
  positionalParams.sort((a, b) => parseInt(a) - parseInt(b));
  namedParams.sort();

  return [...positionalParams, ...namedParams];
}

/**
 * Replace template parameters with user values or fallbacks
 * @param content - Template content with {{parameter}} placeholders
 * @param userValues - Array of user-provided values
 * @param customMapping - Optional custom mapping from template metadata
 * @returns Content with all parameters replaced
 */
export function replaceTemplateParameters(content: string, userValues: string[], customMapping?: Record<string, string>): string {
  // console.log('🔧 replaceTemplateParameters called with:', { content, userValues, customMapping });

  const placeholders = content.match(/\{\{([^}]+)\}\}/g) || [];

  let finalContent = content;

  placeholders.forEach((placeholder, index) => {
    // Extract parameter name (remove curly braces)
    const parameterName = placeholder.replace(/[{}]/g, '').trim();

    // Get user value or fallback
    const userValue = userValues[index] || '';
    const finalValue = getParameterFallback(parameterName, userValue, customMapping);

    // Replace all occurrences of this placeholder
    const oldContent = finalContent;
    // Create a proper regex pattern that escapes the curly braces
    const regexPattern = placeholder.replace(/[{}]/g, '\\$&');
    finalContent = finalContent.replace(new RegExp(regexPattern, 'g'), finalValue);
  });

  return finalContent;
}

/**
 * Get description for a parameter to show in the UI
 * @param parameterName - The name of the parameter
 * @param customMapping - Optional custom mapping from template metadata
 * @returns User-friendly description
 */
export function getParameterDescription(parameterName: string, customMapping?: Record<string, string>): string {
  const cleanName = parameterName.trim().toLowerCase();

  // Check custom mapping first (from template metadata) - this includes input_map for positional
  if (customMapping && customMapping[parameterName]) {
    const mappingValue = customMapping[parameterName].toLowerCase().trim();

    // Convert mapping values to user-friendly descriptions
    switch (mappingValue) {
      case 'customer name':
      case 'customer_name':
        return 'Customer Name';
      case 'agent name':
      case 'agent_name':
        return 'Agent Name';
      case 'customer phone':
      case 'customer_phone':
        return 'Customer Phone';
      case 'first name':
      case 'first_name':
        return 'First Name';
      case 'last name':
      case 'last_name':
        return 'Last Name';
      case 'date':
        return 'Date';
      case 'time':
        return 'Time';
      case 'company':
      case 'store':
        return 'Company/Store';
      case 'order id':
      case 'order_id':
        return 'Order ID';
      case 'amount':
      case 'price':
        return 'Amount/Price';
      case 'product':
      case 'item':
        return 'Product/Item';
      case 'address':
      case 'location':
        return 'Address/Location';
      case 'status':
        return 'Status';
      default:
        // Capitalize and format the mapping value
        return mappingValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  // Special handling for positional parameters - use customMapping if available, else fallback
  if (/^\d+$/.test(cleanName)) {
    // If customMapping has the position, use it; otherwise, use default
    if (customMapping && customMapping[parameterName]) {
      const mappingValue = customMapping[parameterName].toLowerCase().trim();
      switch (mappingValue) {
        case 'customer_name':
          return 'Customer Name';
        case 'agent_name':
          return 'Agent Name';
        case 'customer_phone':
          return 'Customer Phone';
        case 'first_name':
          return 'First Name';
        case 'last_name':
          return 'Last Name';
        case 'date':
          return 'Date';
        case 'time':
          return 'Time';
        case 'company':
        case 'store':
          return 'Company/Store';
        case 'order_id':
          return 'Order ID';
        case 'amount':
        case 'price':
          return 'Amount/Price';
        case 'product':
        case 'item':
          return 'Product/Item';
        case 'address':
        case 'location':
          return 'Address/Location';
        case 'status':
          return 'Status';
        default:
          return mappingValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    const position = parseInt(cleanName);
    switch (position) {
      case 1:
        return 'Customer name';
      case 2:
        return 'Amount/Price';
      case 3:
        return 'Agent name';
      case 4:
        return 'Phone number';
      case 5:
        return 'Date/Time';
      case 6:
        return 'Order ID';
      case 7:
        return 'Product/Item';
      case 8:
        return 'Address/Location';
      case 9:
        return 'Status';
      case 10:
        return 'Company/Store';
      default:
        return `Parameter ${position}`;
    }
  }

  // Special handling for agent parameters
  if (cleanName.includes('agent')) {
    return 'Agent name';
  }

  // Special handling for customer name parameters
  if (cleanName.includes('customer') && cleanName.includes('name')) {
    return 'Customer name';
  }

  const fallback = PARAMETER_FALLBACKS.find(f => f.pattern.test(cleanName));

  if (fallback) {
    return fallback.description;
  }

  // Generate description from parameter name
  return parameterName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
