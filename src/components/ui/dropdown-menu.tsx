import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = 'right',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-[100] mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  destructive = false,
  asChild = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  destructive?: boolean;
  asChild?: boolean;
}) {
  const itemClassName = cn(
    'flex w-full items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-slate-700 hover:bg-slate-100 focus:bg-slate-100',
    destructive && 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50',
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(itemClassName, (children.props as any).className),
      onPointerDown: (e: React.PointerEvent) => {
        e.stopPropagation();
        (children.props as any).onPointerDown?.(e);
      },
      onMouseDown: (e: React.MouseEvent) => {
        e.stopPropagation();
        (children.props as any).onMouseDown?.(e);
      },
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        (children.props as any).onClick?.(e);
        onClick?.();
      },
    });
  }

  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={itemClassName}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}
