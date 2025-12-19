
import React, { useState, useEffect } from 'react';
import { Review, User } from '../types';
import { storageService } from '../services/storageService';

interface ReviewSectionProps {
    productId: string;
    user: User | null;
    onLoginClick: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, user, onLoginClick }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const productReviews = await storageService.getReviews(productId);
                setReviews(productReviews);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!comment.trim()) {
            setError("Please write a comment.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await storageService.addReview({
                productId,
                userId: user.id,
                userEmail: user.username,
                rating,
                comment
            });

            // Refresh reviews
            const updatedReviews = await storageService.getReviews(productId);
            setReviews(updatedReviews);

            // Reset form
            setComment('');
            setRating(5);
            alert("Review submitted successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="mt-20 border-t border-stone-100 pt-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <span className="text-spice-primary font-bold uppercase tracking-widest text-sm">Feedback</span>
                    <h2 className="text-3xl font-bold mt-2 text-stone-900">Customer Reviews</h2>
                    {averageRating && (
                        <div className="flex items-center mt-3 space-x-2">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < Math.round(Number(averageRating)) ? '' : 'text-stone-200'}`}></i>
                                ))}
                            </div>
                            <span className="text-stone-900 font-bold">{averageRating} out of 5</span>
                            <span className="text-stone-400 font-medium">({reviews.length} reviews)</span>
                        </div>
                    )}
                </div>

                {!user ? (
                    <button
                        onClick={onLoginClick}
                        className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg text-sm"
                    >
                        Sign in to Write a Review
                    </button>
                ) : (
                    <div className="bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-spice-primary/10 rounded-full flex items-center justify-center">
                            <i className="fas fa-user text-spice-primary text-xs"></i>
                        </div>
                        <span className="text-stone-600 text-sm font-medium">Posting as <span className="text-stone-900 font-bold">{user.username}</span></span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Review Form */}
                {user && (
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold text-stone-900 mb-6">Write a Review</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-stone-400 mb-3 tracking-widest">Rating</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${rating >= star ? 'bg-amber-100 text-amber-600' : 'bg-stone-50 text-stone-300'
                                                    }`}
                                            >
                                                <i className="fas fa-star"></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase text-stone-400 mb-3 tracking-widest">Your Experience</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-medium text-stone-800 placeholder:text-stone-300 resize-none"
                                        placeholder="Tell us about the quality, aroma, and flavor..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-spice-primary text-white py-4 rounded-2xl font-bold hover:bg-red-900 transition-all shadow-xl shadow-red-900/10 disabled:opacity-50"
                                >
                                    {isSubmitting ? <i className="fas fa-circle-notch animate-spin"></i> : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reviews List */}
                <div className={user ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-spice-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
                                                <i className="fas fa-user"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-stone-900">{review.userEmail.split('@')[0]}</h4>
                                                <div className="flex text-amber-400 text-xs mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-stone-100'}`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-stone-400 font-medium">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-stone-600 leading-relaxed italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <i className="far fa-comment-dots text-stone-300 text-3xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">No reviews yet</h3>
                            <p className="text-stone-500 max-w-xs mx-auto">
                                Be the first to share your experience with this premium spice!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
