export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(deadlineDate: string | null | undefined): {
  days: number;
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
} | null {
  if (!deadlineDate) return null;
  const deadline = new Date(deadlineDate);
  if (isNaN(deadline.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      text: `${Math.abs(diffDays)}d overdue`,
      isUrgent: false,
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      text: 'Due today',
      isUrgent: true,
      isOverdue: false,
    };
  } else if (diffDays === 1) {
    return {
      days: 1,
      text: 'Due tomorrow',
      isUrgent: true,
      isOverdue: false,
    };
  } else {
    return {
      days: diffDays,
      text: `${diffDays} days left`,
      isUrgent: diffDays <= 3,
      isOverdue: false,
    };
  }
}
