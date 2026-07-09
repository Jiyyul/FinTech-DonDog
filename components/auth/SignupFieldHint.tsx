type SignupFieldHintProps = {
  show: boolean;
  message: string;
};

export default function SignupFieldHint({ show, message }: SignupFieldHintProps) {
  if (!show) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-success">
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden />
      {message}
    </p>
  );
}
