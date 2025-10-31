import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TIME_RANGES = [
  { value: "all", label: "Tất cả" },
  { value: "1d", label: "Hôm nay" },
  { value: "7d", label: "7 ngày qua" },
  { value: "30d", label: "30 ngày qua" },
  { value: "90d", label: "3 tháng qua" },
  { value: "1y", label: "1 năm qua" },
];

export default function TimeRangeSelector({
  value,
  onChange,
  disabled,
}: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn khoảng thời gian" />
      </SelectTrigger>
      <SelectContent>
        {TIME_RANGES.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
