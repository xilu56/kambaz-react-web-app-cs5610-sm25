// 统一的日期时间格式化工具

// 将日期转换为HTML datetime-local input的格式 (YYYY-MM-DDTHH:MM)
export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  // 转换为本地时间的ISO字符串格式
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// 将日期转换为显示格式 (MM/DD/YYYY at HH:MM AM/PM)
export const formatDateForDisplay = (date: string | Date | null | undefined): string => {
  if (!date) return "Not set";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";
  
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
  
  return `${dateStr} at ${timeStr}`;
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

// 格式化Due Date显示
export const formatDueDate = (quiz: any): string => {
  if (!quiz.dueDate) return "No due date";
  return `Due ${formatDateForDisplay(quiz.dueDate)}`;
}; 