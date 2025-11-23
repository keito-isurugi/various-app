import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Language, Question } from "@/types/study";
import { CheckCircle2, ExternalLink, Eye, EyeOff, XCircle } from "lucide-react";

interface QuestionCardProps {
	question: Question;
	language: Language;
	showAnswer: boolean;
	onToggleAnswer: () => void;
	onUnderstanding: (understood: boolean) => void;
}

export function QuestionCard({
	question,
	language,
	showAnswer,
	onToggleAnswer,
	onUnderstanding,
}: QuestionCardProps) {
	const questionText =
		language === "ja" ? question.japaneseQuestion : question.englishQuestion;
	const answerText =
		language === "ja" ? question.japaneseAnswer : question.englishAnswer;

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-2 flex-1">
						<div className="flex items-center gap-2 flex-wrap">
							<Badge variant="outline" className="font-semibold">
								{question.group}
							</Badge>
							<Badge variant="secondary" className="text-xs">
								{question.category}
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* 問題文 */}
				<div className="space-y-2">
					<h3 className="text-sm font-semibold text-muted-foreground">
						{language === "ja" ? "問題" : "Question"}
					</h3>
					<p className="text-lg leading-relaxed whitespace-pre-wrap">
						{questionText.replace(/\\n/g, "\n")}
					</p>
				</div>

				{/* 解答表示ボタン */}
				<div className="flex justify-center">
					<Button
						onClick={onToggleAnswer}
						variant={showAnswer ? "secondary" : "default"}
						size="lg"
						className="w-full max-w-xs"
						type="button"
					>
						{showAnswer ? (
							<>
								<EyeOff className="h-5 w-5 mr-2" />
								解答を隠す
							</>
						) : (
							<>
								<Eye className="h-5 w-5 mr-2" />
								解答を見る
							</>
						)}
					</Button>
				</div>

				{/* 解答 */}
				{showAnswer && (
					<div className="space-y-4 border-t pt-6">
						<div className="space-y-2">
							<h3 className="text-sm font-semibold text-muted-foreground">
								{language === "ja" ? "解答" : "Answer"}
							</h3>
							<div className="text-base leading-relaxed bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
								{answerText.replace(/\\n/g, "\n")}
							</div>
						</div>

						{/* 関連リンク */}
						{question.relatedLink &&
							(() => {
								// URLを抽出（<url>形式）
								const urlMatches =
									question.relatedLink.match(/<(https?:\/\/[^>]+)>/g);
								const urls =
									urlMatches?.map((match) => match.slice(1, -1)) || [];

								// URLが含まれている場合はリンクを表示、そうでない場合はテキストのみ表示
								if (urls.length > 0) {
									return (
										<div className="space-y-2">
											<h4 className="text-sm font-semibold text-muted-foreground">
												関連リンク
											</h4>
											<div className="space-y-2">
												{urls.map((url, index) => (
													<a
														key={index}
														href={url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer"
													>
														<ExternalLink className="h-4 w-4 flex-shrink-0" />
														<span className="break-all">{url}</span>
													</a>
												))}
											</div>
										</div>
									);
								}

								// URLが含まれていない場合はテキストのみ表示
								return (
									<div className="space-y-2">
										<h4 className="text-sm font-semibold text-muted-foreground">
											関連
										</h4>
										<p className="text-sm text-muted-foreground">
											{question.relatedLink}
										</p>
									</div>
								);
							})()}

						{/* 理解度ボタン */}
						<div className="space-y-3 pt-4">
							<p className="text-sm font-medium text-center">
								この問題を理解できましたか？
							</p>
							<div className="grid grid-cols-2 gap-3">
								<Button
									onClick={() => onUnderstanding(true)}
									variant="outline"
									size="lg"
									className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
									type="button"
								>
									<CheckCircle2 className="h-5 w-5 mr-2" />
									わかった
								</Button>
								<Button
									onClick={() => onUnderstanding(false)}
									variant="outline"
									size="lg"
									className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
									type="button"
								>
									<XCircle className="h-5 w-5 mr-2" />
									わからなかった
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
