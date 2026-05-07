import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1" data-testid="star-rating">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < rating ? "fill-primary text-primary" : "text-muted-foreground fill-none"}
        />
      ))}
    </div>
  );
}
