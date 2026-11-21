"""Private revisions migration acceptance in isolated in-memory SQLite only."""
import sqlite3, uuid
from pathlib import Path
base=Path(__file__).parent.parent/'drizzle'
db=sqlite3.connect(':memory:')
db.execute('PRAGMA foreign_keys=ON')
for name in ['0003_life_cycle_drafts.sql','0004_life_cycle_revisions.sql']:
 db.executescript((base/name).read_text().replace('--> statement-breakpoint',''))
draft_id=str(uuid.uuid4())
db.execute('INSERT INTO experience_life_cycle_drafts VALUES (?,?,?,?,?,?,?,?)',
 (draft_id,'member-A','fashion','GOLD','Original concept',str(uuid.uuid4()),'hash','2026-11-21T00:00:00Z'))
rev_id=str(uuid.uuid4())
db.execute('INSERT INTO experience_life_cycle_revisions VALUES (?,?,?,?,?,?,?)',
 (rev_id,'member-A',draft_id,'Approved revision',str(uuid.uuid4()),'hash2','2026-11-21T01:00:00Z'))
original=db.execute('SELECT brief FROM experience_life_cycle_drafts WHERE id=?',(draft_id,)).fetchone()
latest=db.execute('SELECT brief FROM experience_life_cycle_revisions WHERE owner_id=? AND draft_id=? ORDER BY rowid DESC LIMIT 1',('member-A',draft_id)).fetchone()
other=db.execute('SELECT brief FROM experience_life_cycle_revisions WHERE owner_id=? AND draft_id=?',('member-B',draft_id)).fetchone()
assert original==('Original concept',)
assert latest==('Approved revision',)
assert other is None
assert db.execute('SELECT COUNT(*) FROM experience_life_cycle_revisions WHERE draft_id=?',(draft_id,)).fetchone()[0]==1
try:
 db.execute('INSERT INTO experience_life_cycle_revisions VALUES (?,?,?,?,?,?,?)',
  (str(uuid.uuid4()),'member-A','not-a-real-draft','X',str(uuid.uuid4()),'hash3','2026-11-21T02:00:00Z'))
 raise AssertionError('Missing foreign-key protection')
except sqlite3.IntegrityError:pass
print('PASS: append-only original, owner separation, revision FK, independent migration')
