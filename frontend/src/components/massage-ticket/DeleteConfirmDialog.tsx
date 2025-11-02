/**
 * 肩たたき券削除確認ダイアログ
 */

"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	ticketName?: string;
	isDeleting?: boolean;
}

export function DeleteConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	ticketName,
	isDeleting = false,
}: DeleteConfirmDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>肩たたき券を削除</DialogTitle>
					<DialogDescription>
						{ticketName
							? `「${ticketName}」の肩たたき券を削除しますか？この操作は取り消せません。`
							: "この肩たたき券を削除しますか？この操作は取り消せません。"}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isDeleting}>
						キャンセル
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? "削除中..." : "削除"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
