import { useState } from "react";

interface CreateRoomModalControllerProps {
  onClose: () => void;
  onSubmit: (roomData: {
    name: string;
    isPrivate: boolean;
    password?: string;
  }) => void;
}

const useCreateRoomModalController = ({
  onClose,
  onSubmit,
}: CreateRoomModalControllerProps) => {
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    if (isPrivate && !password.trim()) {
      setError("Password is required for private rooms");
      return;
    }

    onSubmit({
      name: roomName,
      isPrivate,
      ...(isPrivate && { password }),
    });

    setRoomName("");
    setIsPrivate(false);
    setPassword("");
    setError("");
    onClose();
  };

  const onModalClose = () => {
    setRoomName("");
    setIsPrivate(false);
    setPassword("");
    setError("");
    onClose();
  };

  return {
    roomName,
    isPrivate,
    password,
    error,
    handleSubmit,
    setRoomName,
    setIsPrivate,
    setPassword,
    setError,
    onModalClose,
  };
};

export default useCreateRoomModalController;
