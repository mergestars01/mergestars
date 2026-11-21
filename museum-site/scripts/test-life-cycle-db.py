"""No CORE/production data. Tests only the new Museum SQLite migration in memory."""
from pathlib import Path
import sqlite3,uuid,datetime

migration=Path(__file__).parent.parent/"drizzle"/"0003_life_cycle_drafts.sql"
sql=migration.read_text().replace('--> statement-breakpoint','')
db=sqlite3.connect(':memory:')
db.execute('PRAGMA foreign_keys=ON')
db.executescript(sql)
insert=("INSERT OR IGNORE INTO experience_life_cycle_drafts "
"(id,owner_id,cycle_id,line,brief,request_id,request_hash,created_at) "
"SELECT ?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM experience_life_cycle_drafts "
"WHERE owner_id=? AND cycle_id=? AND line=?) < 12")
def save(owner,cycle,line,request_id=None):
    request_id=request_id or str(uuid.uuid4())
    draft_id=str(uuid.uuid4())
    params=(draft_id,owner,cycle,line,"Design",request_id,"checksum","2026-11-21T00:00:00Z",owner,cycle,line)
    db.execute(insert,params)
    row=db.execute('SELECT id FROM experience_life_cycle_drafts WHERE owner_id=? AND request_id=?',(owner,request_id)).fetchone()
    return bool(row),row[0] if row else None
for i in range(12):
    created,_=save('member-A','fashion','GOLD')
    assert created
created,_=save('member-A','fashion','GOLD')
assert not created,'13th draft cannot be inserted'
assert save('member-A','fashion','SILVER')[0]
assert save('member-A','wedding','GOLD')[0]
assert save('member-B','fashion','GOLD')[0]
req=str(uuid.uuid4())
assert save('member-A','nature','GOLD',req)[0]
before=db.execute('SELECT COUNT(*) FROM experience_life_cycle_drafts').fetchone()[0]
assert save('member-A','nature','GOLD',req)[0]
assert db.execute('SELECT COUNT(*) FROM experience_life_cycle_drafts').fetchone()[0]==before
assert db.execute("SELECT COUNT(*) FROM experience_life_cycle_drafts WHERE owner_id='member-A'").fetchone()[0]==15
assert db.execute("SELECT COUNT(*) FROM experience_life_cycle_drafts WHERE owner_id='member-B'").fetchone()[0]==1
print('PASS: actual additive D1 migration, 12-slot cap, owner separation, idempotency index')
