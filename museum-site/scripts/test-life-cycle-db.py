"""Migration compatibility only. Store behavior is exercised by test-life-cycle-api.mjs."""
from pathlib import Path
import sqlite3, uuid
folder = Path(__file__).parent.parent / 'drizzle'
db = sqlite3.connect(':memory:')
db.execute('PRAGMA foreign_keys=ON')
db.executescript((folder / '0003_life_cycle_drafts.sql').read_text())
old_id = str(uuid.uuid4())
db.execute('INSERT INTO experience_life_cycle_drafts VALUES (?,?,?,?,?,?,?,?)',
           (old_id, 'legacy-owner', 'fashion', 'GOLD', 'Original', str(uuid.uuid4()), 'old-hash', '2026-11-20T00:00:00Z'))
db.executescript((folder / '0004_life_cycle_revisions.sql').read_text())
db.executescript((folder / '0005_life_cycle_versions.sql').read_text())
assert db.execute('SELECT owner_id, brief, root_draft_id, parent_draft_id FROM experience_life_cycle_drafts').fetchone() == ('legacy-owner', 'Original', old_id, None)
assert 'idx_life_cycle_owner_root' in {r[1] for r in db.execute('PRAGMA index_list(experience_life_cycle_drafts)')}
assert db.execute('PRAGMA foreign_key_check').fetchall() == []
print('PASS: additive versions migration preserves original briefs, ownership, root lineage and constraints')
