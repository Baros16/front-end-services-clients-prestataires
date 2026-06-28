import React from "react";
import {
  Phone,
  Video,
  MoreVertical,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

const ChatHeader = ({
  name = "zynelle ",
  status = "Online now",
  avatar = "/images/zynelle.jpg",
  onFinalizeQuote,
  onOpenMenu,
  onCall,
  onVideoCall,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-100 shadow-sm"
            />

            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {name}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck
                size={15}
                className="text-emerald-500"
              />

              <span className="text-sm text-slate-500">
                {status}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Audio Call */}
          <button
            onClick={onCall}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition-all duration-200"
            title="Audio Call"
          >
            <Phone size={19} />
          </button>

          {/* Video Call */}
          <button
            onClick={onVideoCall}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition-all duration-200"
            title="Video Call"
          >
            <Video size={19} />
          </button>

          {/* Finalize Quote */}
          <button
            onClick={onFinalizeQuote}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            <FileCheck2 size={18} />
            <span>Finalize Quote</span>
          </button>

          {/* More Menu */}
          <button
            onClick={onOpenMenu}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
            title="More Options"
          >
            <MoreVertical size={20} />
          </button>

        </div>

      </div>
    </header>
  );
};

export default ChatHeader;