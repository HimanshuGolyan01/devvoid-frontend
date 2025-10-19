import { useState } from "react";
import { X, Sparkles, Send, FileText } from "lucide-react";
import { ai } from "../lib/api";
import type { Task } from "../lib/types";

interface AIAssistantProps {
    projectId: string;
    tasks: Task[];
    onClose: () => void;
}

export function AIAssistant({ projectId, tasks, onClose }: AIAssistantProps) {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const handleSummarize = async () => {
        setLoading(true);
        setError("");
        setResponse("");

        try {
            const data = await ai.summarize(projectId, tasks);
            setResponse(data.summary);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError("");
        setResponse("");

        try {
            const data = await ai.ask(projectId, tasks, question);
            setResponse(data.answer);
            setQuestion("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-500 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                AI Assistant
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Powered by Google Gemini
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 hover:bg-gray-800/50 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            About AI Assistant
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            This AI assistant uses Google Gemini API to analyze
                            your project tasks. You can get a quick summary of
                            all tasks or ask specific questions about your
                            project.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleSummarize}
                            disabled={loading || tasks.length === 0}
                            className="w-full px-4 py-3 bg-white text-black rounded-lg transition transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading
                                ? "Generating Summary..."
                                : "Summarize All Tasks"}
                        </button>

                        {tasks.length === 0 && (
                            <p className="text-gray-500 text-sm text-center">
                                No tasks available to summarize
                            </p>
                        )}
                    </div>

                    {response && (
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-white leading-relaxed whitespace-pre-wrap">
                                        {response}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-800">
                    <form onSubmit={handleAsk} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Ask a Question
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    className="flex-1 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-50"
                                    placeholder="e.g., How many tasks are in progress?"
                                    disabled={loading || tasks.length === 0}
                                />
                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        !question.trim() ||
                                        tasks.length === 0
                                    }
                                    className="px-4 py-3 bg-white hover:from-gray-800 hover:to-gray-600 text-black rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
