interface QuoteProps {
  quote: string;
  name: string;
  date: string;
}
export default function Quote(props: QuoteProps) {
  const { quote, name, date } = props;

  return (
    <div className="flex flex-col card bg-base-100 shadow-xl max-w-md w-full h-min p-4 m-2">
      <div className="flex justify-between w-full mb-4">
        <p>{name}</p>
        <p>{date}</p>
      </div>
      <p>"{quote}"</p>
    </div>
  );
}
