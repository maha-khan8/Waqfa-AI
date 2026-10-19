import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Info,
  ExternalLink,
  ShieldAlert,
  X,
  Save,
  Building,
} from 'lucide-react';
import { ApplicationEntry, ApplicationStatus, DocumentCheckItem } from '../types';

interface ApplicationTrackerViewProps {
  applications: ApplicationEntry[];
  onAddApplication: (entry: ApplicationEntry) => void;
  onUpdateApplication: (entry: ApplicationEntry) => void;
  onDeleteApplication: (id: string) => void;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  Researching: {
    label: 'Researching',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  Preparing: {
    label: 'Preparing Documents & Test',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  Submitted: {
    label: 'Submitted Application',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  'Interview / Test': {
    label: 'Interview / Test Scheduled',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
  },
  Accepted: {
    label: 'Accepted / Offer Received',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  'Waitlisted / Other': {
    label: 'Waitlist / Other',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
  },
};

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<ApplicationEntry | null>(null);

  // Form states for modal
  const [formUni, setFormUni] = useState('');
  const [formDegree, setFormDegree] = useState('');
  const [formExam, setFormExam] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formIsVerified, setFormIsVerified] = useState(false);
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('Researching');
  const [formNotes, setFormNotes] = useState('');
  const [formNextAction, setFormNextAction] = useState('');
  const [formDocs, setFormDocs] = useState<DocumentCheckItem[]>([]);
  const [newDocText, setNewDocText] = useState('');

  const openAddModal = () => {
    setEditingEntry(null);
    setFormUni('');
    setFormDegree('');
    setFormExam('');
    setFormDeadline('');
    setFormIsVerified(false);
    setFormStatus('Researching');
    setFormNotes('');
    setFormNextAction('');
    setFormDocs([
      { id: 'd-1', name: 'Matric / O-Level Sanad or Equivalence', checked: false },
      { id: 'd-2', name: 'FSc Part-1 / Statement of Results', checked: false },
      { id: 'd-3', name: 'CNIC / Juvenile Card / B-Form photocopy', checked: false },
      { id: 'd-4', name: 'Passport-size photographs', checked: false },
      { id: 'd-5', name: 'Fee challan payment proof', checked: false },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (entry: ApplicationEntry) => {
    setEditingEntry(entry);
    setFormUni(entry.universityName);
    setFormDegree(entry.degreeProgram);
    setFormExam(entry.entranceExam);
    setFormDeadline(entry.applicationDeadline);
    setFormIsVerified(entry.isDeadlineVerified);
    setFormStatus(entry.status);
    setFormNotes(entry.notes);
    setFormNextAction(entry.nextAction);
    setFormDocs(entry.requiredDocuments);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUni.trim()) return;

    if (editingEntry) {
      const updated: ApplicationEntry = {
        ...editingEntry,
        universityName: formUni.trim(),
        degreeProgram: formDegree.trim() || 'Degree to be decided',
        entranceExam: formExam.trim() || 'Standard entrance exam',
        applicationDeadline: formDeadline.trim() || 'Check official portal',
        isDeadlineVerified: formIsVerified,
        status: formStatus,
        requiredDocuments: formDocs,
        notes: formNotes.trim(),
        nextAction: formNextAction.trim(),
        updatedAt: new Date().toISOString(),
      };
      onUpdateApplication(updated);
    } else {
      const newEntry: ApplicationEntry = {
        id: `app-${Date.now()}`,
        universityName: formUni.trim(),
        degreeProgram: formDegree.trim() || 'Degree to be decided',
        entranceExam: formExam.trim() || 'Standard entrance exam',
        applicationDeadline: formDeadline.trim() || 'Check official portal',
        isDeadlineVerified: formIsVerified,
        status: formStatus,
        requiredDocuments: formDocs,
        notes: formNotes.trim(),
        nextAction: formNextAction.trim(),
        isNextActionDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddApplication(newEntry);
    }
    setIsModalOpen(false);
  };

  const toggleDocCheck = (entry: ApplicationEntry, docId: string) => {
    const updatedDocs = entry.requiredDocuments.map((doc) =>
      doc.id === docId ? { ...doc, checked: !doc.checked } : doc
    );
    onUpdateApplication({
      ...entry,
      requiredDocuments: updatedDocs,
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleNextActionDone = (entry: ApplicationEntry) => {
    onUpdateApplication({
      ...entry,
      isNextActionDone: !entry.isNextActionDone,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateStatusDirect = (entry: ApplicationEntry, newStatus: ApplicationStatus) => {
    onUpdateApplication({
      ...entry,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddModalDoc = () => {
    if (!newDocText.trim()) return;
    setFormDocs([
      ...formDocs,
      { id: `doc-${Date.now()}`, name: newDocText.trim(), checked: false },
    ]);
    setNewDocText('');
  };

  const handleRemoveModalDoc = (id: string) => {
    setFormDocs(formDocs.filter((d) => d.id !== id));
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.universityName.toLowerCase().includes(q) ||
        app.degreeProgram.toLowerCase().includes(q) ||
        app.entranceExam.toLowerCase().includes(q) ||
        app.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Light Clean Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 rounded-md">
                Application Tracker
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Space_Grotesk']">
              University Admissions & Deadlines
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Track your actual target university admissions, entrance tests, document checklists,
              and application progress. All data remains private to your device.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal()}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({applications.length})
          </button>
          {(['Researching', 'Preparing', 'Submitted', 'Accepted'] as ApplicationStatus[]).map(
            (st) => {
              const count = applications.filter((a) => a.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            }
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search universities, degrees..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
          />
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredApps.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              Your next opportunity starts here.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
              You haven't added any universities yet. Add a university to organize its requirements,
              entrance examinations, application tasks, and deadlines.
            </p>
            <button
              onClick={() => openAddModal()}
              className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-colors"
            >
              Add University
            </button>
          </div>
        ) : (
          filteredApps.map((entry) => {
            const statusStyle = STATUS_CONFIG[entry.status] || STATUS_CONFIG.Researching;
            const checkedDocs = entry.requiredDocuments.filter((d) => d.checked).length;
            const totalDocs = entry.requiredDocuments.length;
            const docsDone = totalDocs > 0 && checkedDocs === totalDocs;

            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                        {entry.universityName}
                      </h3>
                      <p className="text-xs font-medium text-teal-800 mt-0.5">{entry.degreeProgram}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(entry)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteApplication(entry.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Exam & Deadline info badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Entrance Exam
                      </span>
                      <span className="font-semibold text-slate-800">{entry.entranceExam}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Application Deadline
                        </span>
                        {entry.isDeadlineVerified ? (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 rounded">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-medium bg-amber-100 px-1.5 rounded">
                            Not verified
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-slate-800 leading-tight block">
                        {entry.applicationDeadline}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown Picker */}
                  <div className="flex items-center justify-between py-2 border-y border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Application Status:</span>
                    <select
                      value={entry.status}
                      onChange={(e) =>
                        updateStatusDirect(entry, e.target.value as ApplicationStatus)
                      }
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      <option value="Researching">Researching</option>
                      <option value="Preparing">Preparing Documents & Test</option>
                      <option value="Submitted">Submitted Application</option>
                      <option value="Interview / Test">Interview / Test</option>
                      <option value="Accepted">Accepted / Offer</option>
                      <option value="Waitlisted / Other">Waitlisted / Other</option>
                    </select>
                  </div>

                  {/* Document Checklist */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        Required Documents ({checkedDocs}/{totalDocs})
                      </span>
                      {docsDone && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          All Prepared
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {entry.requiredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => toggleDocCheck(entry, doc.id)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-xs transition-colors"
                        >
                          {doc.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={
                              doc.checked ? 'text-slate-400 line-through' : 'text-slate-700'
                            }
                          >
                            {doc.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes if present */}
                  {entry.notes && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 text-xs text-slate-600 border border-slate-100">
                      <span className="font-semibold text-slate-700 block mb-0.5">Notes:</span>
                      {entry.notes}
                    </div>
                  )}
                </div>

                {/* Next Action Box */}
                {entry.nextAction && (
                  <div
                    onClick={() => toggleNextActionDone(entry)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2 ${
                      entry.isNextActionDone
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-teal-50 border-teal-200 text-teal-950'
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0">
                      {entry.isNextActionDone ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-teal-700" />
                      )}
                    </button>
                    <div className="text-xs">
                      <span className="font-bold uppercase tracking-wider block text-[10px] opacity-75">
                        Immediate Next Action:
                      </span>
                      <span
                        className={entry.isNextActionDone ? 'line-through text-slate-400' : 'font-medium'}
                      >
                        {entry.nextAction}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                  {editingEntry ? 'Edit University Application' : 'Add Target University'}
                </h3>
                <p className="text-xs text-slate-500">
                  Track requirements, entrance exams, and deadlines.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-900 mb-1">
                  University / Institution Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formUni}
                  onChange={(e) => setFormUni(e.target.value)}
                  placeholder="e.g. NUST, FAST-NU, LUMS, King Edward / UHS, GIKI, IBA"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    Intended Degree / Program
                  </label>
                  <input
                    type="text"
                    value={formDegree}
                    onChange={(e) => setFormDegree(e.target.value)}
                    placeholder="e.g. BS Computer Science, MBBS, BBA"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    Entrance Exam (if applicable)
                  </label>
                  <input
                    type="text"
                    value={formExam}
                    onChange={(e) => setFormExam(e.target.value)}
                    placeholder="e.g. NUST NET, MDCAT, ECAT, SAT"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="text"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    placeholder="e.g. 15 July 2026 or Spring 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    Current Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Researching">Researching</option>
                    <option value="Preparing">Preparing Documents & Test</option>
                    <option value="Submitted">Submitted Application</option>
                    <option value="Interview / Test">Interview / Test Scheduled</option>
                    <option value="Accepted">Accepted / Offer Received</option>
                    <option value="Waitlisted / Other">Waitlisted / Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="deadlineVerified"
                  checked={formIsVerified}
                  onChange={(e) => setFormIsVerified(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="deadlineVerified" className="text-slate-700 cursor-pointer">
                  I have independently verified this deadline on the official university portal.
                </label>
              </div>

              {/* Required Documents in Modal */}
              <div>
                <label className="block font-semibold text-slate-900 mb-1">
                  Required Documents Checklist
                </label>
                <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                  {formDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200"
                    >
                      <span className="text-slate-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveModalDoc(doc.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDocText}
                    onChange={(e) => setNewDocText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddModalDoc();
                      }
                    }}
                    placeholder="Add document: e.g. Domicile, Equivalence, Statement of Purpose"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddModalDoc}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">
                  Immediate Next Action
                </label>
                <input
                  type="text"
                  value={formNextAction}
                  onChange={(e) => setFormNextAction(e.target.value)}
                  placeholder="e.g. Download past NET Series paper from portal"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">
                  Notes & Research Insights
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Minimum FSc percentage is 60%, test has negative marking, hostel forms open in August"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEntry ? 'Update Application' : 'Save Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
