import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className,
        "text-base",
        "text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border cursor-pointer transition-all border-destructive/2 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap- rounded-xl py-6 shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-3 rounded-xl py-6 shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap- rounded-xl py-6 shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-2 rounded-xl py-6 shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-2 rounded-xl py- shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-2 rounded-xl py-2 shadow-sm border cursor-pointer transition-all border-destructive/20 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-2 rounded-xl py-2 shadow-sm border cursor-pointer transition-all border-destructive/2 bg-destructive/10 text-base",
        "text-card-foreground flex flex-col gap-2 rounded-xl py-2 shadow-sm border cursor-pointer transition-all border-destructive/2 bg-destructive/1 text-base"
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className, "p-", "p-3", "p-", "p-2")}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
