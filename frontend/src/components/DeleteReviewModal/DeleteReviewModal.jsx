// frontend/src/components/DeleteReviewModal/DeleteReviewModal

import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from "../../store/reviews";
import './DeleteReviewModal.css';

const DeleteReviewModal = ({ review }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(reviewActions.deleteReview(review.id));
        closeModal();
        alert("Review Deleted");
    }

    return (
        <div className="delete-review-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <button 
                onClick={handleDelete}
                className="yes-button"
            >Yes (Delete Review)</button>
            <button 
                onClick={closeModal}
                className="no-button"
            >No (Keep Review)</button>
        </div>
    );
}

export default DeleteReviewModal