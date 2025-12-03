import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

function cx(base: string, extra?: string) {
  return base + (extra ? " " + extra : "");
}

export function Card(props: CardProps) {
  return (
    <div
      {...props}
      className={cx(
        "rounded-2xl border border-slate-200/20 bg-white/10 p-6 shadow backdrop-blur",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export function CardHeader(props: CardProps) {
  return (
    <div {...props} className={cx("mb-3", props.className)}>
      {props.children}
    </div>
  );
}

export function CardTitle(props: CardProps) {
  return (
    <h2
      {...props}
      className={cx("text-xl font-semibold leading-none", props.className)}
    >
      {props.children}
    </h2>
  );
}

export function CardContent(props: CardProps) {
  return (
    <div {...props} className={props.className}>
      {props.children}
    </div>
  );
}





