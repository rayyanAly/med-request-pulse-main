import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone, User, ChevronDown, X } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { RootState, AppDispatch } from "@/redux/store";
import { sendTemplateToNumber, fetchTemplates } from "@/redux/actions/templateActions";
import { Template, Customer } from "@/redux/types";
import { extractParameterNames, getParameterDescription, replaceTemplateParameters, getParameterFallback } from "@/components/Parameterfallback";
import { SET_ALL_CUSTOMERS_CACHE } from "@/redux/constants/whatsappConstants";

interface SendTemplateDialogProps {
  templates?: Template[];
  initialTemplate?: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFirstName?: string;
  initialLastName?: string;
  initialPhone?: string;
  initialCountryCode?: string;
}

const countryCodes = [
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia' },
  { code: '+965', country: 'KW', name: 'Kuwait' },
  { code: '+973', country: 'BH', name: 'Bahrain' },
  { code: '+974', country: 'QA', name: 'Qatar' },
  { code: '+968', country: 'OM', name: 'Oman' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+60', country: 'MY', name: 'Malaysia' }
];

export default function SendTemplateDialog({ templates, initialTemplate, open, onOpenChange, initialFirstName, initialLastName, initialPhone, initialCountryCode }: SendTemplateDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { allCustomersCache } = useSelector((state: RootState) => state.whatsapp);
  const reduxTemplates = useSelector((state: RootState) => state.template?.templates);
  
  // Use provided templates or fall back to Redux templates
  const availableTemplates = templates && templates.length > 0 ? templates : reduxTemplates || [];

  // Form state
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [templateParams, setTemplateParams] = useState<Record<string, string>>({});
  const [buttonValues, setButtonValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(initialTemplate || (availableTemplates && availableTemplates.length > 0 ? availableTemplates[0] : null));

  // Customer search state
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCache, setIsFetchingCache] = useState(false);

  // Fetch templates if not available
  useEffect(() => {
    if (open && (!availableTemplates || availableTemplates.length === 0)) {
      dispatch(fetchTemplates());
    }
  }, [open, availableTemplates?.length, dispatch]);

  // Initialize form with initial props
  useEffect(() => {
    if (open) {
      if (initialFirstName) setFirstName(initialFirstName);
      if (initialLastName) setLastName(initialLastName);
      if (initialCountryCode) setCountryCode(initialCountryCode);
      if (initialPhone) {
        // Strip country code and leading 0 from initial phone
        let cleanPhone = initialPhone.replace(/\D/g, '');
        const ccDigits = (initialCountryCode || '+971').replace(/\D/g, '');
        if (cleanPhone.startsWith(ccDigits)) {
          cleanPhone = cleanPhone.substring(ccDigits.length);
        }
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1);
        }
        setPhone(cleanPhone);
      }
      if (initialTemplate) {
        setSelectedTemplate(initialTemplate);
      }
    }
  }, [open, initialFirstName, initialLastName, initialPhone, initialCountryCode, initialTemplate]);

  // Fetch all customers if cache is empty when dialog opens
  useEffect(() => {
    if (open && allCustomersCache.length === 0 && !isFetchingCache) {
      const fetchAllCustomers = async () => {
        setIsFetchingCache(true);
        try {
          const headers = {
            'X-API-Key': 'your_api_key_here',
            'Content-Type': 'application/json',
          };
          
          const firstResponse = await fetch(`/api/external/search-customers?per_page=50&page=1`, { headers });
          if (!firstResponse.ok) throw new Error('Failed to fetch customers');
          const firstData = await firstResponse.json();
          const totalPages = firstData.last_page;
          let allData: any[] = [...firstData.data];
          
          if (totalPages > 1) {
            const allPromises = [];
            for (let p = 2; p <= totalPages; p++) {
              allPromises.push(
                fetch(`/api/external/search-customers?per_page=50&page=${p}`, { headers })
                  .then(res => res.json())
                  .then(data => data.data)
              );
            }
            const allPagesData = await Promise.all(allPromises);
            allPagesData.forEach(pageData => {
              allData = [...allData, ...pageData];
            });
          }
          
          dispatch({ type: SET_ALL_CUSTOMERS_CACHE, payload: allData });
          setIsFetchingCache(false);
        } catch (error) {
          console.error('Error fetching all customers:', error);
          setIsFetchingCache(false);
        }
      };
      
      fetchAllCustomers();
    }
  }, [open, allCustomersCache.length, dispatch, isFetchingCache]);

  // Helper to get full customer name
  const getFullCustomerName = () => {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
  };

  // Helper to highlight matching text
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </span>
      ) : part
    );
  };

  // Unified debounced search for both name and phone
  useEffect(() => {
    const hasFirstNameSearch = firstName.trim() && !selectedCustomer;
    const hasLastNameSearch = lastName.trim() && !selectedCustomer;
    const hasPhoneSearch = phone.trim() && !selectedCustomer;

    if ((hasFirstNameSearch || hasLastNameSearch || hasPhoneSearch) && allCustomersCache.length > 0) {
      setIsSearching(true);

      // Debounce search by 300ms
      const searchTimeout = setTimeout(() => {
        let filtered: Customer[] = [];

        // Helper function to get name parts
        const getNameParts = (fullName: string | null) => {
          if (!fullName) return { first: '', last: '' };
          if (fullName.startsWith('Contact ')) return { first: '', last: '' };
          const parts = fullName.trim().split(' ');
          return {
            first: parts[0] || '',
            last: parts.slice(1).join(' ') || ''
          };
        };

        // Check if the entered phone number exists in contacts
        const phoneOnly = phone.replace(/\D/g, '');
        const phoneExistsInContacts = allCustomersCache.some(customer => {
          const customerPhone = customer.mobile.replace(/\D/g, '');
          return customerPhone.includes(phoneOnly);
        });

        filtered = allCustomersCache.filter(customer => {
          let matches = false;

          // Phone search - always allow if phone is entered
          if (hasPhoneSearch) {
            const customerPhone = customer.mobile.replace(/\D/g, '');
            matches = matches || customerPhone.includes(phoneOnly);
          }

          // Name search - only allow if phone exists in contacts or no phone is entered
          if ((hasFirstNameSearch || hasLastNameSearch) && (!hasPhoneSearch || phoneExistsInContacts)) {
            // First name search
            if (hasFirstNameSearch) {
              const nameParts = getNameParts(customer.name);
              matches = matches || nameParts.first.toLowerCase().includes(firstName.toLowerCase());
            }

            // Last name search
            if (hasLastNameSearch) {
              const nameParts = getNameParts(customer.name);
              matches = matches || nameParts.last.toLowerCase().includes(lastName.toLowerCase());
            }
          }

          return matches;
        });

        // Sort results: prioritize based on search type
        filtered = filtered.sort((a, b) => {
          // Helper function to get name parts
          const getNameParts = (fullName: string | null) => {
            if (!fullName) return { first: '', last: '' };
            if (fullName.startsWith('Contact ')) return { first: '', last: '' };
            const parts = fullName.trim().split(' ');
            return {
              first: parts[0] || '',
              last: parts.slice(1).join(' ') || ''
            };
          };

          // Prioritize exact matches
          if (hasFirstNameSearch) {
            const aParts = getNameParts(a.name);
            const bParts = getNameParts(b.name);
            const aExact = aParts.first.toLowerCase() === firstName.toLowerCase();
            const bExact = bParts.first.toLowerCase() === firstName.toLowerCase();
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = aParts.first.toLowerCase().startsWith(firstName.toLowerCase());
            const bStarts = bParts.first.toLowerCase().startsWith(firstName.toLowerCase());
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
          }

          if (hasLastNameSearch) {
            const aParts = getNameParts(a.name);
            const bParts = getNameParts(b.name);
            const aExact = aParts.last.toLowerCase() === lastName.toLowerCase();
            const bExact = bParts.last.toLowerCase() === lastName.toLowerCase();
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = aParts.last.toLowerCase().startsWith(lastName.toLowerCase());
            const bStarts = bParts.last.toLowerCase().startsWith(lastName.toLowerCase());
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
          }

          if (hasPhoneSearch) {
            const aPhone = a.mobile.replace(/\D/g, '');
            const bPhone = b.mobile.replace(/\D/g, '');

            const aExact = aPhone === phoneOnly;
            const bExact = bPhone === phoneOnly;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = aPhone.startsWith(phoneOnly);
            const bStarts = bPhone.startsWith(phoneOnly);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
          }

          // Alphabetical fallback
          const aName = a.name || '';
          const bName = b.name || '';
          return aName.localeCompare(bName);
        });

        setFilteredCustomers(filtered);
        setShowSearchDropdown(filtered.length > 0 && (hasFirstNameSearch || hasLastNameSearch || hasPhoneSearch));
        setSelectedIndex(-1); // Reset selection
        setIsSearching(false);
      }, 300);

      // Cleanup timeout
      return () => clearTimeout(searchTimeout);
    } else {
      setShowSearchDropdown(false);
      setIsSearching(false);
    }
  }, [firstName, lastName, phone, countryCode, selectedCustomer, allCustomersCache]);

  // Auto-fill template parameters based on available data
  const autoFillParameters = (paramNames: string[]) => {
    const autoFilledParams: Record<string, string> = {};
    const fullName = getFullCustomerName();
    const fullPhoneNumber = `${countryCode.replace('+', '')}${phone}`;
    const agentName = 'Agent';
    const firstNameVal = firstName || '';
    const lastNameVal = lastName || '';

    paramNames.forEach(paramKey => {
      const key = paramKey.toLowerCase();

      // Handle positional parameters using input_map
      if (/^\d+$/.test(key)) {
        const position = parseInt(key);
        const mappedName = selectedTemplate?.input_map ? selectedTemplate.input_map[position - 1] : undefined;

        if (mappedName) {
          const mappedKey = mappedName.toLowerCase();
          if (mappedKey === 'customer_name') {
            autoFilledParams[paramKey] = fullName;
          } else if (mappedKey === 'agent_name') {
            autoFilledParams[paramKey] = agentName;
          } else if (mappedKey === 'customer_phone') {
            autoFilledParams[paramKey] = fullPhoneNumber;
          } else if (mappedKey === 'first_name') {
            autoFilledParams[paramKey] = firstNameVal;
          } else if (mappedKey === 'last_name') {
            autoFilledParams[paramKey] = lastNameVal;
          } else if (mappedKey === 'date') {
            autoFilledParams[paramKey] = new Date().toLocaleDateString();
          } else if (mappedKey === 'time') {
            autoFilledParams[paramKey] = new Date().toLocaleTimeString();
          } else if (mappedKey === 'company' || mappedKey === 'store') {
            autoFilledParams[paramKey] = '800 Pharmacy';
          } else {
            autoFilledParams[paramKey] = '';
          }
        } else {
          // Fallback to default positional logic
          switch (position) {
            case 1:
              autoFilledParams[paramKey] = fullName;
              break;
            case 2:
              autoFilledParams[paramKey] = '';
              break;
            case 3:
              autoFilledParams[paramKey] = agentName;
              break;
            case 4:
              autoFilledParams[paramKey] = fullPhoneNumber;
              break;
            case 5:
              autoFilledParams[paramKey] = new Date().toLocaleDateString();
              break;
            default:
              autoFilledParams[paramKey] = '';
          }
        }
      }
      // Handle named parameters
      else {
        if (key.includes('agent')) {
          autoFilledParams[paramKey] = agentName;
        } else if ((key.includes('customer') && key.includes('name')) || key === 'name' || key === 'client' || key === 'user') {
          autoFilledParams[paramKey] = fullName;
        } else if (key === 'firstname' || key === 'first_name' || key === 'first') {
          autoFilledParams[paramKey] = firstNameVal;
        } else if (key === 'lastname' || key === 'last_name' || key === 'last') {
          autoFilledParams[paramKey] = lastNameVal;
        } else if (key.includes('phone') || key.includes('number') || key.includes('mobile')) {
          autoFilledParams[paramKey] = fullPhoneNumber;
        } else if (key.includes('date')) {
          autoFilledParams[paramKey] = new Date().toLocaleDateString();
        } else if (key.includes('time')) {
          autoFilledParams[paramKey] = new Date().toLocaleTimeString();
        } else {
          autoFilledParams[paramKey] = '';
        }
      }
    });

    return autoFilledParams;
  };

  // Template selection handler - auto-fill params when template or customer data changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.template) {
      console.log('=== AUTO-FILL PARAMETERS ===');
      console.log('selectedTemplate:', selectedTemplate.name);
      console.log('firstName:', firstName);
      console.log('lastName:', lastName);
      console.log('phone:', phone);
      console.log('countryCode:', countryCode);
      
      const params = extractParameterNames(selectedTemplate.template);
      console.log('extracted params:', params);
      
      const autoFilledParams = autoFillParameters(params);
      console.log('autoFilledParams:', autoFilledParams);
      
      setTemplateParams(autoFilledParams);
      console.log('============================');
    }
  }, [selectedTemplate, firstName, lastName, phone, countryCode]);

  // Auto-select first template if none selected and templates become available
  useEffect(() => {
    if (!selectedTemplate && availableTemplates && availableTemplates.length > 0) {
      setSelectedTemplate(availableTemplates[0]);
    }
  }, [availableTemplates, selectedTemplate]);

  // Customer selection handlers
  const handleCustomerSelect = (customer: Customer) => {
    console.log('=== CUSTOMER SELECTION DEBUG ===');
    console.log('customer:', customer);
    
    const customerName = customer.name || '';
    console.log('customerName:', customerName);
    console.log('customer.crm_data:', customer.crm_data);
    
    // Check if this is a guest/contact without name
    const isGuest = !customerName || customerName.startsWith('Contact ');
    console.log('isGuest:', isGuest);
    
    // Fill ALL fields when a customer is selected
    if (isGuest) {
      // For guests/contacts without names, set as Guest User
      console.log('Setting Guest User');
      setFirstName('Guest');
      setLastName('User');
    } else {
      const nameParts = customerName.trim().split(' ');
      console.log('nameParts:', nameParts);
      console.log('Setting firstName:', nameParts[0] || '');
      console.log('Setting lastName:', customer.crm_data?.lastname || nameParts.slice(1).join(' ') || '');
      setFirstName(nameParts[0] || '');
      setLastName(customer.crm_data?.lastname || nameParts.slice(1).join(' ') || '');
    }
    console.log('After setState - firstName should be:', isGuest ? 'Guest' : customerName.trim().split(' ')[0]);
    console.log('After setState - lastName should be:', isGuest ? 'User' : (customer.crm_data?.lastname || customerName.trim().split(' ').slice(1).join(' ') || ''));
    console.log('================================');
    
    // Always fill phone - strip country code if present
    const customerMobile = customer.mobile.replace(/\D/g, ''); // Remove non-digits
    let detectedCountryCode = '+971'; // Default
    let phoneWithoutCode = customerMobile;
    
    // Try to detect country code from the mobile number
    for (const cc of countryCodes) {
      const codeDigits = cc.code.replace(/\D/g, '');
      if (customerMobile.startsWith(codeDigits)) {
        detectedCountryCode = cc.code;
        phoneWithoutCode = customerMobile.substring(codeDigits.length);
        break;
      }
    }
    
    // Strip leading 0 if present
    if (phoneWithoutCode.startsWith('0')) {
      phoneWithoutCode = phoneWithoutCode.substring(1);
    }
    
    setCountryCode(detectedCountryCode);
    setPhone(phoneWithoutCode);

    // Auto-update template parameters with selected customer data
    if (selectedTemplate && selectedTemplate.template) {
      const paramNames = extractParameterNames(selectedTemplate.template);
      const customerName = customer.name || '';
      const customerPhone = phoneWithoutCode; // Use stripped phone number
      const fullPhoneNumber = `${detectedCountryCode.replace('+', '')}${phoneWithoutCode}`; // Full number without +
      const agentName = 'Agent'; // Default agent name
      let firstNameVal = '';
      let lastNameVal = '';
      if (customerName) {
        const nameParts = customerName.trim().split(' ');
        firstNameVal = nameParts[0] || '';
        lastNameVal = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      }

      const updatedParams: Record<string, string> = {};

      paramNames.forEach(paramKey => {
        const key = paramKey.toLowerCase();

        // Handle positional parameters using input_map
        if (/^\d+$/.test(key)) {
          const position = parseInt(key);
          const mappedName = selectedTemplate.input_map ? selectedTemplate.input_map[position - 1] : undefined;

          if (mappedName) {
            const mappedKey = mappedName.toLowerCase();
            if (mappedKey === 'customer_name') {
              updatedParams[paramKey] = customerName;
            } else if (mappedKey === 'agent_name') {
              updatedParams[paramKey] = agentName;
            } else if (mappedKey === 'customer_phone') {
              updatedParams[paramKey] = fullPhoneNumber;
            } else if (mappedKey === 'first_name') {
              updatedParams[paramKey] = firstNameVal;
            } else if (mappedKey === 'last_name') {
              updatedParams[paramKey] = lastNameVal;
            } else if (mappedKey === 'date') {
              updatedParams[paramKey] = new Date().toLocaleDateString();
            } else if (mappedKey === 'time') {
              updatedParams[paramKey] = new Date().toLocaleTimeString();
            } else if (mappedKey === 'company' || mappedKey === 'store') {
              updatedParams[paramKey] = '800 Pharmacy';
            } else {
              updatedParams[paramKey] = '';
            }
          } else {
            // Fallback to default positional logic
            switch (position) {
              case 1:
                updatedParams[paramKey] = customerName;
                break;
              case 2:
                updatedParams[paramKey] = '';
                break;
              case 3:
                updatedParams[paramKey] = agentName;
                break;
              case 4:
                updatedParams[paramKey] = fullPhoneNumber;
                break;
              case 5:
                updatedParams[paramKey] = new Date().toLocaleDateString();
                break;
              default:
                updatedParams[paramKey] = '';
            }
          }
        }
        // Handle named parameters
        else {
          if (key.includes('agent')) {
            updatedParams[paramKey] = agentName;
          } else if ((key.includes('customer') && key.includes('name')) || key === 'name' || key === 'client' || key === 'user') {
            updatedParams[paramKey] = customerName;
          } else if (key === 'firstname' || key === 'first_name' || key === 'first') {
            updatedParams[paramKey] = firstNameVal;
          } else if (key === 'lastname' || key === 'last_name' || key === 'last') {
            updatedParams[paramKey] = lastNameVal;
          } else if (key.includes('phone') || key.includes('number') || key.includes('mobile')) {
            updatedParams[paramKey] = fullPhoneNumber;
          } else if (key.includes('date')) {
            updatedParams[paramKey] = new Date().toLocaleDateString();
          } else if (key.includes('time')) {
            updatedParams[paramKey] = new Date().toLocaleTimeString();
          } else {
            updatedParams[paramKey] = '';
          }
        }
      });

      setTemplateParams(updatedParams);
    }

    setSelectedCustomer(customer);
    setShowSearchDropdown(false);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchDropdown || filteredCustomers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredCustomers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCustomers.length) {
          handleCustomerSelect(filteredCustomers[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSearchDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Form input handlers
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFirstName = e.target.value;
    setFirstName(newFirstName);

    if (!newFirstName.trim()) {
      setPhone("");
      setLastName("");
      setSelectedCustomer(null);
      setTemplateParams({});
      setShowSearchDropdown(false);
    } else {
      setSelectedCustomer(null);
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLastName = e.target.value;
    setLastName(newLastName);

    if (!newLastName.trim()) {
      setSelectedCustomer(null);
      setShowSearchDropdown(false);
    } else {
      setSelectedCustomer(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    // Strip any country code if present
    const currentCountryCodeDigits = countryCode.replace(/\D/g, '');
    if (value.startsWith(currentCountryCodeDigits)) {
      value = value.substring(currentCountryCodeDigits.length);
    } else {
      // Check if it starts with any other country code and remove it
      for (const cc of countryCodes) {
        const codeDigits = cc.code.replace(/\D/g, '');
        if (value.startsWith(codeDigits) && codeDigits !== currentCountryCodeDigits) {
          // Update country code dropdown and strip from phone
          setCountryCode(cc.code);
          value = value.substring(codeDigits.length);
          break;
        }
      }
    }

    if (countryCode === '+971') {
      if (value.startsWith('0')) {
        value = value.substring(1);
      }
      if (value.length > 9) {
        value = value.substring(0, 9);
      }
    }

    setPhone(value);

    if (selectedCustomer) {
      setSelectedCustomer(null);
      setFirstName('');
      setLastName('');
    }
  };

  // Parameter management
  const setParam = (paramName: string, value: string) => {
    setTemplateParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setPhone(initialPhone || "");
    setFirstName(initialFirstName || "");
    setLastName(initialLastName || "");
    setCountryCode(initialCountryCode || "+971");
    setTemplateParams({});
    setButtonValues({});
    setSelectedCustomer(null);
    setShowSearchDropdown(false);
    setSelectedTemplate(initialTemplate || (templates && templates.length > 0 ? templates[0] : null));
    setBusy(false);
  };

  // Submit handler
  const handleCreate = async () => {
    const phoneNumber = phone.trim();
    const firstNameTrimmed = firstName.trim();

    if (!phoneNumber || !firstNameTrimmed || !selectedTemplate) {
      return;
    }

    // Validate parameters
    const templateParamNames = Object.keys(templateParams);
    const emptyParams = templateParamNames.filter(paramName => !templateParams[paramName] || templateParams[paramName].trim() === '');

    if (templateParamNames.length > 0 && emptyParams.length > 0) {
      return;
    }

    let buttonParams: any = undefined;
    if (selectedTemplate?.button_params && selectedTemplate.button_params.length > 0) {
      buttonParams = {};
      selectedTemplate.button_params.forEach((param, index) => {
        const label = param.label || param.text || `Button ${index + 1}`;
        const value = buttonValues[label];
        if (selectedTemplate?.name === 'payment_link') {
          const urlMatch = value.match(/\/([^\/]+)$/);
          buttonParams[index.toString()] = urlMatch ? urlMatch[1] : value;
        } else {
          buttonParams[index.toString()] = value;
        }
      });
    }

    const params = templateParamNames.length > 0 ?
      templateParamNames.map(paramName => templateParams[paramName].trim()) :
      [];

    // Strip any existing country code from phone number before adding the selected one
    let cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const selectedCountryCodeDigits = countryCode.replace(/\D/g, '');
    
    // If the phone already starts with the selected country code, remove it
    if (cleanPhone.startsWith(selectedCountryCodeDigits)) {
      cleanPhone = cleanPhone.substring(selectedCountryCodeDigits.length);
    } else {
      // Check if it starts with any other country code and remove it
      for (const cc of countryCodes) {
        const codeDigits = cc.code.replace(/\D/g, '');
        if (cleanPhone.startsWith(codeDigits)) {
          cleanPhone = cleanPhone.substring(codeDigits.length);
          break;
        }
      }
    }
    
    // Construct full phone number with country code (without + sign for API)
    const fullPhoneNumber = `${selectedCountryCodeDigits}${cleanPhone}`;

    console.log('=== PHONE DEBUG ===');
    console.log('phone state:', phone);
    console.log('phoneNumber (trimmed):', phoneNumber);
    console.log('countryCode:', countryCode);
    console.log('selectedCountryCodeDigits:', selectedCountryCodeDigits);
    console.log('cleanPhone:', cleanPhone);
    console.log('fullPhoneNumber:', fullPhoneNumber);
    console.log('==================');

    try {
      setBusy(true);

      dispatch(sendTemplateToNumber(selectedTemplate.name, selectedTemplate.language, fullPhoneNumber, params, buttonParams));

      resetForm();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Send failed', error);
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Get current template for preview
  const currentTemplate = selectedTemplate;

  // Generate preview message with parameters replaced
  const getPreviewMessage = () => {
    if (!currentTemplate || !currentTemplate.template) {
      return "Select a template to see preview";
    }

    let preview = currentTemplate.template;
    preview = preview.replace(/<br\s*\/?>/gi, '\n').replace(/\r\n/g, '\n');

    const finalMessage = replaceTemplateParameters(preview, Object.values(templateParams));
    return finalMessage;
  };

  // Get list of parameters from current template
  const getTemplateParameters = (): string[] => {
    if (!currentTemplate || !currentTemplate.template) return [];
    return extractParameterNames(currentTemplate.template);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5 text-primary" />
            Send Template
          </DialogTitle>
          <DialogDescription>
            Send a template message to a customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Selector */}
          {availableTemplates && availableTemplates.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="template" className="text-sm font-medium">Template *</Label>
              <Select 
                value={selectedTemplate?.name || ''} 
                onValueChange={(value) => {
                  const template = availableTemplates.find(t => t.name === value);
                  if (template) setSelectedTemplate(template);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template to send" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Phone Number with Country Code */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-28">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={countryCodes.find(c => c.code === countryCode)?.country || 'AE'}
                        svg
                        style={{ width: '16px', height: '12px' }}
                      />
                      <span className="text-sm">{countryCode}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={country.country}
                          svg
                          style={{ width: '16px', height: '12px' }}
                        />
                        <span>{country.code}</span>
                        <span className="text-muted-foreground text-xs">{country.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Phone Input */}
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="50 XXX XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                  autoComplete="off"
                  maxLength={countryCode === '+971' ? 9 : undefined}
                />
              </div>
            </div>
            {selectedCustomer && (
              <p className="text-xs text-muted-foreground">
                Auto-filled from existing customer
              </p>
            )}
          </div>

          {/* Customer Name with Auto-search */}
          <div className="space-y-2 relative">
            <Label className="text-sm font-medium">
              Customer Name
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
              <div className="relative flex-1">
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Unified Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                <div className="flex justify-between items-center px-3 py-2 border-b border-border">
                  <span className="text-sm font-medium">Search Results</span>
                  <X className="w-4 h-4 cursor-pointer hover:text-destructive" onClick={() => setShowSearchDropdown(false)} />
                </div>
                {isSearching ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No contacts found
                  </div>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                        index === selectedIndex
                          ? 'bg-accent border-l-2 border-primary'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm">
                        {customer.name && customer.name.startsWith('Contact ') ?
                          <span className="text-muted-foreground">{highlightMatch(customer.name, firstName.trim() ? firstName : lastName.trim() ? lastName : '')}</span> :
                          <span>{highlightMatch(customer.name || 'Unknown', firstName.trim() ? firstName : lastName.trim() ? lastName : '')}</span>
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {highlightMatch(customer.mobile, phone.trim() ? phone.replace(/\D/g, '') : '')}
                      </div>
                    </div>
                    <div className="text-xs text-primary">
                      {customer.name && customer.name.startsWith('Contact ') ? 'No Name' : 'Existing'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {selectedCustomer && (
              <p className="text-xs text-muted-foreground">
                Auto-filled from existing customer
              </p>
            )}
          </div>

          {/* Template Parameters */}
          {(() => {
            const templateParameters = getTemplateParameters();
            return templateParameters.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Parameters
                </Label>
                <div className="space-y-3">
                  {templateParameters.map((paramName) => (
                    <div key={paramName} className="space-y-1">
                      <Label className="text-xs font-medium">
                        {getParameterDescription(paramName, currentTemplate?.input_map ?
                          currentTemplate.input_map.reduce((acc, val, idx) => ({ ...acc, [getTemplateParameters()[idx]]: val }), {}) :
                          {})}
                      </Label>
                      <Input
                        placeholder={`Enter ${getParameterDescription(paramName, currentTemplate?.input_map ?
                          currentTemplate.input_map.reduce((acc, val, idx) => ({ ...acc, [getTemplateParameters()[idx]]: val }), {}) :
                          {}).toLowerCase()}`}
                        value={templateParams[paramName] || ""}
                        onChange={(e) => setParam(paramName, e.target.value)}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400">
                        Will default to: <span className="font-medium text-gray-500">"{getParameterFallback(paramName, '', currentTemplate?.input_map ?
                          currentTemplate.input_map.reduce((acc, val, idx) => ({ ...acc, [getTemplateParameters()[idx]]: val }), {}) :
                          {})}"</span> if left empty
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Button Parameters */}
          {Array.isArray(currentTemplate?.button_params) && currentTemplate?.button_params?.map((param, index) => {
            const label = param.label || param.text || `Button ${index + 1}`;
            const value = buttonValues[label] || '';
            const hint = param.hints || `Enter ${label.toLowerCase()}...`;
            return (
              <div key={index} className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  {label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>

                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setButtonValues(prev => ({
                    ...prev,
                    [label]: e.target.value,
                  }))}
                  placeholder={`${hint} (leave empty for default)`}
                  className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />

                <div className="text-xs text-gray-400">
                  Will default to:{" "}
                  <span className="font-medium text-gray-500">
                    "{getParameterFallback(label, '')}"
                  </span>{" "}
                  if left empty
                </div>
              </div>
            );
          })}

          {/* Template Preview */}
          {currentTemplate && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="text-sm text-foreground whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {getPreviewMessage()}
                </div>
              </div>
            </div>
          )}

        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!phone.trim() || !firstName.trim() || !selectedTemplate || busy}
            className="bg-primary hover:bg-primary/90"
          >
            {busy ? "Sending..." : "Send Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}