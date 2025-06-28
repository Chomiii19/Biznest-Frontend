import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useState, useRef } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { IComments } from "../@types/interfaces";
import icons from "../constants/icons";
import { formatCount } from "../utils/formatCount";
import { getRelativeTime } from "../utils/formatTime";
import { useBottomSheet } from "../context/bottomSheetContext";
import { PlatformPressable } from "@react-navigation/elements";
import renderBackdrop from "./BottomSheetBackdrop";

function BottomSheetComponent() {
  const { bottomSheetRef, snapPoints, comments, postOwner } = useBottomSheet();
  const [createComment, setCreateComment] = useState("");
  const [upvotedComments, setUpvotedComments] = useState<Set<string>>(
    new Set()
  );
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
  const [replyingTo, setReplyingTo] = useState("");

  const toggleUpvote = (id: string) => {
    setUpvotedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);

      return newSet;
    });
  };

  const toggleReplies = (index: number, username: string) => {
    setOpenReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);

      return newSet;
    });

    setReplyingTo((prev) => (prev === username ? "" : username));
  };

  return (
    <BottomSheet
      enablePanDownToClose
      enableContentPanningGesture={false}
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#848483" }}
      backgroundStyle={{ backgroundColor: "#1B1A1B" }}
      backdropComponent={renderBackdrop}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView className="pt-2 bg-light-black w-full h-full">
          <View className="items-center flex-row gap-2 mb-2 px-4">
            <Text className="text-zinc-300 font-rBold text-xl">Comments</Text>
            <Text className="text-zinc-600 font-rRegular">
              {`(${formatCount(comments.length)})`}
            </Text>
          </View>

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            className="w-full px-4 flex-1"
          >
            {comments.map((comment, i) => {
              const commentId = `comment-${i}`;
              return (
                <View key={commentId} className="mb-2">
                  <CommentComponent
                    type="comment"
                    comment={comment}
                    isUpvoted={upvotedComments.has(commentId)}
                    onToggleUpvote={() => toggleUpvote(commentId)}
                    onToggleReplies={() => toggleReplies(i, comment.username)}
                    setReplyingTo={setReplyingTo}
                  />

                  {openReplies.has(i) && (
                    <View className="ml-10 flex-1 border-l border-l-zinc-700 pl-5">
                      {comment.replies &&
                        comment.replies.map((reply, j) => {
                          const replyId = `reply-${i}-${j}`;
                          return (
                            <CommentComponent
                              key={replyId}
                              type="reply"
                              comment={reply}
                              isUpvoted={upvotedComments.has(replyId)}
                              onToggleUpvote={() => toggleUpvote(replyId)}
                              onToggleReplies={() => {}}
                              setReplyingTo={setReplyingTo}
                            />
                          );
                        })}
                    </View>
                  )}
                </View>
              );
            })}
          </BottomSheetScrollView>

          <View className="bg-light-black w-full p-2 px-4 border-t border-t-zinc-700 flex-col gap-1">
            {replyingTo && (
              <View className="flex-row gap-2 items-center">
                <Text className="text-zinc-300 font-rRegular">{`Replying to ${replyingTo}`}</Text>
                <TouchableOpacity onPress={() => setReplyingTo("")}>
                  <Text className="text-primary font-rRegular">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            <View className="items-center justify-between flex-row gap-3 w-full">
              <TextInput
                placeholder={
                  replyingTo
                    ? `Reply on ${replyingTo}'s comment...`
                    : `Comment on ${postOwner}'s post...`
                }
                placeholderTextColor={"#71717a"}
                multiline
                value={createComment}
                onChangeText={setCreateComment}
                textAlignVertical="top"
                scrollEnabled
                className="bg-zinc-800/80 rounded-lg text-zinc-300 font-rRegular max-h-36 flex-1"
              />
              <TouchableOpacity
                className={`p-2 rounded-full bg ${createComment.length > 0 ? "bg-primary" : "bg-zinc-800/80"}`}
              >
                <Image
                  source={icons.send}
                  resizeMode="contain"
                  className="h-5 w-5"
                  tintColor={createComment.length > 0 ? "#d4d4d8" : "#71717a"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

function CommentComponent({
  type,
  comment,
  isUpvoted,
  onToggleUpvote,
  onToggleReplies,
  setReplyingTo,
}: {
  type: string;
  comment: IComments | undefined;
  isUpvoted: boolean;
  onToggleUpvote: () => void;
  onToggleReplies: () => void;
  setReplyingTo: React.Dispatch<React.SetStateAction<string>>;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    onToggleUpvote();
    animate();
  };

  if (!comment) return;

  return (
    <PlatformPressable className="flex-col gap-2 bg-zinc-800 mb-2 p-2 rounded-lg">
      <View className="flex-row items-center gap-1">
        <Text className="text-zinc-300 font-rSemibold text-lg">
          {comment.username}
        </Text>
        <Text className="text-zinc-500 font-rRegular text-xs">
          {getRelativeTime(comment.createdAt)}
        </Text>
      </View>

      <Text className="text-zinc-300 font-rRegular">
        {comment.text.length > 100
          ? comment.text.slice(0, 100).concat("...")
          : comment.text}
      </Text>

      <View className="gap-2 flex-row items-center">
        <View className="gap-1 flex-row items-center">
          <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.View
              style={[styles.iconContainer, { transform: [{ scale }] }]}
            >
              <Image
                source={isUpvoted ? icons["arrowUp-fill"] : icons.arrowUp}
                tintColor={isUpvoted ? "#7862BF" : "#848483"}
                className="h-5 w-5 scale-y-[-1]"
                resizeMode="contain"
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <Text className="text-zinc-500 font-rRegular text-sm">
            {formatCount(comment.upvote_count)}
          </Text>
        </View>
        {type === "comment" && (
          <TouchableOpacity
            onPress={() => onToggleReplies()}
            className="gap-1 flex-row items-center"
          >
            <Image
              source={icons.comment}
              tintColor={"#848483"}
              className="h-5 w-5"
            />
            <Text className="text-zinc-500 font-rRegular text-sm">
              {formatCount(comment?.replies?.length ?? 0)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </PlatformPressable>
  );
}

export default BottomSheetComponent;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
