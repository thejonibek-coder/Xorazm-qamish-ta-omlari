import { Activity, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import type { ApiLogEntry } from '@/types';

interface NetworkConsoleProps {
  logs: ApiLogEntry[];
}

const methodColors: Record<string, string> = {
  GET: 'text-blue-600 bg-blue-50',
  POST: 'text-emerald-600 bg-emerald-50',
  PATCH: 'text-amber-600 bg-amber-50',
  DELETE: 'text-red-600 bg-red-50',
};

const statusColors: Record<number, string> = {
  200: 'text-emerald-600',
  201: 'text-emerald-600',
  400: 'text-amber-600',
  404: 'text-red-600',
  500: 'text-red-600',
};

export default function NetworkConsole({ logs }: NetworkConsoleProps) {
  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      {/* Console header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Tarmoq so'rovlari</span>
          <span className="text-xs text-slate-500">({logs.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </div>

      {/* Logs */}
      <div className="max-h-96 overflow-y-auto font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            So'rovlar yo'q. Admin amallarini bajaring yoki buyurtma bering.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors"
            >
              {/* Time */}
              <span className="text-slate-500 shrink-0">{log.timestamp}</span>

              {/* Method badge */}
              <span className={`px-2 py-0.5 rounded font-bold shrink-0 ${methodColors[log.method] || 'text-slate-400 bg-slate-800'}`}>
                {log.method}
              </span>

              {/* Path with arrow icon */}
              <span className="flex items-center gap-1 text-slate-300 flex-1 min-w-0">
                {log.method === 'GET' ? (
                  <ArrowDownLeft className="w-3 h-3 text-blue-400 shrink-0" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400 shrink-0" />
                )}
                <span className="truncate">{log.path}</span>
              </span>

              {/* Status */}
              <span className={`font-bold shrink-0 ${statusColors[log.status] || 'text-slate-400'}`}>
                {log.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
