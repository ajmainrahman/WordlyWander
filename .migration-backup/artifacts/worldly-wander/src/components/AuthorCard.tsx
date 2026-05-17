import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function AuthorCard() {
  return (
    <div className="mt-16 border border-border rounded-2xl p-6 sm:p-8 bg-muted/30 flex flex-col sm:flex-row gap-6 items-start" data-testid="author-card">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80"
        alt="The WordlyWander family"
        className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
      />
      <div className="flex-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary/60 mb-1">Written by</p>
        <h3 className="font-serif text-xl font-bold text-foreground mb-1">The Hossains</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          A writing family from Dhaka who travel Bangladesh one river, one temple, and one plate of biryani at a time. We believe this country deserves better travel writing.
        </p>
        <div className="flex gap-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebook size={16} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram size={16} /></a>
        </div>
      </div>
    </div>
  );
}
