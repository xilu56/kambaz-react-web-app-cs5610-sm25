// 统一的日期时间格式化工具

// 将日期转换为HTML datetime-local input的格式 (YYYY-MM-DDTHH:MM)
export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  // 获取本地时间的各个部分（避免时区转换问题）
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}T${hours}:${minutes}`;
  console.log("formatDateForInput:", { input: date, output: result, dateObj: d });
  return result;
};

// 将日期转换为显示格式 (MM/DD/YYYY at HH:MM AM/PM)
export const formatDateForDisplay = (date: string | Date | null | undefined): string => {
  if (!date) return "Not set";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";
  
  console.log("formatDateForDisplay:", { input: date, dateObj: d, timezone: d.getTimezoneOffset() });
  
  const dateStr = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  const result = `${dateStr} at ${timeStr}`;
  console.log("formatDateForDisplay result:", result);
  return result;
};

// 将日期转换为简短格式 (MM/DD/YYYY)
export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return "Not set";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 将datetime-local输入值转换为Date对象（保持本地时间）
export const parseLocalDateTime = (datetimeLocalValue: string): Date | null => {
  if (!datetimeLocalValue) return null;
  
  // datetime-local格式: "2025-07-01T00:00"
  // 我们需要将其解释为本地时间，而不是UTC时间
  const [datePart, timePart] = datetimeLocalValue.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  
  // 使用本地时间创建Date对象
  const date = new Date(year, month - 1, day, hour, minute);
  console.log("parseLocalDateTime:", { input: datetimeLocalValue, output: date });
  return date;
};

// 格式化Due Date显示
export const formatDueDate = (quiz: any): string => {
  if (!quiz.dueDate) return "No due date";
  return `Due ${formatDateForDisplay(quiz.dueDate)}`;
}; 