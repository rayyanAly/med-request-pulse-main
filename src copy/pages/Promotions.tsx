import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchPromotions, fetchPromotionSummary } from "@/redux/actions/promotionActions";
import PromotionHeader from "@/components/promotions/PromotionHeader";
import PromotionSummary from "@/components/promotions/PromotionSummary";
import PromotionFilters from "@/components/promotions/PromotionFilters";
import PromotionTable from "@/components/promotions/PromotionTable";
import PromotionSkeleton from "@/components/promotions/PromotionSkeleton";

export default function Promotions() {
  const dispatch = useDispatch<AppDispatch>();
  const { promotions, allPromotions, manufacturers, loading, error, summary, loadingSummary, errorSummary, pagination } = useSelector((state: any) => state.promotions);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [valueFilter, setValueFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPromotions(1, 50) as any); // Load all data once
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPromotionSummary() as any);
  }, [dispatch]);

  // Sort promotions by start_date ascending (earliest first)
  const sortedPromotions = [...allPromotions].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const uniqueManufacturers = manufacturers;
  const uniqueValues = Array.from(new Set(sortedPromotions.map((p: any) => p.promotion_value))).sort((a, b) => parseInt(a as string) - parseInt(b as string)) as string[];

  const allFiltered = sortedPromotions.filter((promo) => {
    const matchesSearch =
      searchQuery === "" ||
      promo.promotion_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.item_code.toLowerCase().includes(searchQuery.toLowerCase());
    const promoType = promo.promotion_type.replace('fix_percent', 'Fixed Percentage').replace('buy_one_get_one_free', 'Buy One Get One Free').replace('buy_one_get_50%_second', 'Buy One Get 50% Second').replace('buy_two_get_one_free', 'Buy Two Get One Free').replace(/_/g, ' ');
    const matchesType = typeFilter === "all" || promoType === typeFilter;
    const matchesManufacturer = manufacturerFilter === "all" || promo.manufacturer_name === manufacturerFilter;
    const matchesValue = valueFilter === "all" || promo.promotion_value === valueFilter;
    return matchesSearch && matchesType && matchesManufacturer && matchesValue;
  });

  const totalFiltered = allFiltered.length;
  const totalPages = Math.ceil(totalFiltered / 50);
  const start = (currentPage - 1) * 50;
  const end = start + 50;
  const filteredPromotions = allFiltered.slice(start, end).map((promo) => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    // Set end date to 23:59:59 in Dubai timezone (UTC+4)
    const endDate = new Date(promo.end_date);
    endDate.setHours(23, 59, 59, 999);
    
    // Adjust to Dubai timezone (UTC+4)
    const dubaiOffset = 4 * 60; // Dubai is UTC+4
    const nowDubai = new Date(now.getTime() + (now.getTimezoneOffset() + dubaiOffset) * 60000);
    const startDateDubai = new Date(startDate.getTime() + (startDate.getTimezoneOffset() + dubaiOffset) * 60000);
    const endDateDubai = new Date(endDate.getTime() + (endDate.getTimezoneOffset() + dubaiOffset) * 60000);
    
    const isActive = nowDubai >= startDateDubai && nowDubai <= endDateDubai;
    return {
      id: promo.id,
      code: promo.promotion_code,
      itemCode: promo.item_code,
      productName: promo.product_name,
      type: promo.promotion_type.replace('fix_percent', 'Fixed Percentage').replace('buy_one_get_one_free', 'Buy One Get One Free').replace('buy_one_get_50%_second', 'Buy One Get 50% Second').replace('buy_two_get_one_free', 'Buy Two Get One Free').replace(/_/g, ' '),
      value: parseInt(promo.promotion_value),
      stock: promo.available_stock,
      inStock: promo.in_stock,
      manufacturer: promo.manufacturer_name,
      startDate: promo.start_date,
      endDate: promo.end_date,
      status: isActive ? 'active' : 'expired',
    };
  });

  if (loading) {
    return <PromotionSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PromotionHeader />
      <PromotionSummary summary={summary} loadingSummary={loadingSummary} errorSummary={errorSummary} />
      <PromotionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        manufacturerFilter={manufacturerFilter}
        setManufacturerFilter={setManufacturerFilter}
        valueFilter={valueFilter}
        setValueFilter={setValueFilter}
        setCurrentPage={setCurrentPage}
        uniqueManufacturers={uniqueManufacturers}
        uniqueValues={uniqueValues}
        filteredPromotions={allFiltered}
      />
      <PromotionTable
        filteredPromotions={filteredPromotions}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalFiltered={totalFiltered}
        start={start}
        end={end}
      />
    </div>
  );
}