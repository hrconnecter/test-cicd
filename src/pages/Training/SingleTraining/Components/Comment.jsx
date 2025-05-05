import { Star } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Avatar alt="a" />
      </div>
      <div className="flex-1">
        <div>
          <div className="flex justify-start items-end gap-2">
            <span className="font-bold text-xl  text-gray-700">
              {comment?.employeeId?.first_name} {comment?.employeeId?.last_name}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment?.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-700">{comment?.comment}</p>
        <div className="flex items-center mt-1">
          <Star
            className={`h-2  text-yellow-400
              }`}
          />

          <span className="ml-1 text-sm text-gray-600">{comment?.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
