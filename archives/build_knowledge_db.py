"""
build_knowledge_db.py — Extrae el conocimiento valioso de archives/ y lo guarda en SQLite.
"""
import sqlite3, os, json, subprocess, re, textwrap
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'knowledge_base.db')
ARCHIVES_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.dirname(ARCHIVES_DIR)

CATEGORIES = {
    'architecture': ['ARCHITECTURE', 'architecture_v6', 'DVGE-v6-Architecture', 'SPECIFICATION'],
    'audit': ['AUDIT', 'audit', 'QA_REMEDIATION', 'SESSION_AUDIT'],
    'plan': ['plan', 'roadmap', 'implementation_plan', 'tasks'],
    'monetization': ['MONETIZATION', 'COMMERCIAL_STRATEGY'],
    'design': ['DESIGN_SYSTEM', 'RESPONSIVE_PROTOCOL', 'BRAND_IDENTITY'],
    'spec': ['SPECIFICATION', 'dvge_v5'],
    'prototype': ['v1_lottie_native'],
    'tool': ['dvge-sync', 'deploy', 'generate-rules'],
    'proposal': ['NEXT_GEN', 'PROPOSALS'],
    'knowledge': ['KNOWLEDGE_BRIDGE', 'info', 'MASTER_PROMPT'],
    'notes': ['idea minima', 'Pendiente', 'FONT_INJECTION'],
    'legal': ['LEGAL', 'PLUGIN_POLICY', 'EULA'],
}

def classify_file(rel_path):
    name = os.path.basename(rel_path)
    full_path = rel_path.replace('\\', '/').lower()
    
    # Check parent directory for clues
    if 'v1_lottie_native' in full_path:
        return 'prototype'
    if 'dvge-sync' in full_path:
        return 'tool'
    if 'scripts/' in full_path:
        return 'tool'
    if 'templates/' in full_path and 'lottie' in full_path:
        return 'prototype'
    
    for cat, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw.lower() in name.lower():
                return cat
    
    return 'uncategorized'

def get_git_log(file_path):
    """Get full git history for a file."""
    try:
        result = subprocess.run(
            ['git', 'log', '--follow', '--format=%H|%an|%ai|%s', '--', file_path],
            capture_output=True, text=True, cwd=PROJECT_ROOT, timeout=30
        )
        commits = []
        for line in result.stdout.strip().split('\n'):
            if not line.strip():
                continue
            parts = line.split('|', 3)
            if len(parts) == 4:
                commits.append({
                    'hash': parts[0],
                    'author': parts[1],
                    'date': parts[2],
                    'message': parts[3]
                })
        return commits
    except Exception as e:
        return [{'hash': 'unknown', 'author': 'unknown', 'date': 'unknown', 'message': f'Error: {e}'}]

def extract_valuable_content(content, filename):
    """Extract key insights from content."""
    insights = []
    decisions = []
    
    # Look for decision markers
    dec_patterns = [
        r'(?:^|\n)\s*[Dd]ecisi[óo]n\s*[:\-]?\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)',
        r'(?:^|\n)\s*[Dd]ecision\s*[:\-]?\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)',
        r'(?:^|\n)\s*[Aa]cuerdo\s*[:\-]?\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)',
        r'(?:^|\n)\s*[Rr]eason\s*[:\-]?\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)',
        r'(?:^|\n)\s*[Rr]az[óo]n\s*[:\-]?\s*(.+?)(?=\n\s*\n|\n\s*[A-Z]|\Z)',
        r'ADR[-\s]?\d+',
        r'##?\s*(?:Decision|Architecture Decision)',
    ]
    for pat in dec_patterns:
        matches = re.findall(pat, content, re.MULTILINE | re.DOTALL)
        decisions.extend([m.strip()[:200] for m in matches if m.strip()])
    
    # Look for important conclusions
    insight_patterns = [
        r'(?:^|\n)\s*[Ll]ecci[óo]n\s*(?:aprendida|learned)?\s*[:\-]?\s*(.+?)(?=\n\s*\n|\Z)',
        r'(?:^|\n)\s*[Cc]onclusion\s*[:\-]?\s*(.+?)(?=\n\s*\n|\Z)',
        r'(?:^|\n)\s*[Ii]mportant\s*[:\-]?\s*(.+?)(?=\n\s*\n|\Z)',
        r'(?:^|\n)\s*[Cc]onsejo\s*[:\-]?\s*(.+?)(?=\n\s*\n|\Z)',
        r'(?:^|\n)\s*[Ww]arning\s*[:\-]?\s*(.+?)(?=\n\s*\n|\Z)',
        r'(?:^|\n)\s*[Nn]ota\s*(?:importante)?\s*[:\-]?\s*(.+?)(?=\n\s*\n|\Z)',
        r'(?:\*\*IMPORTANTE?\:\*\*|\*\*NOTE:\*\*)\s*(.+?)(?=\n\s*\n|\Z)',
    ]
    for pat in insight_patterns:
        matches = re.findall(pat, content, re.MULTILINE | re.DOTALL)
        insights.extend([m.strip()[:200] for m in matches if m.strip()])
    
    return list(set(decisions)), list(set(insights))

def generate_summary(content, filename):
    """Generate a brief summary based on filename and content structure."""
    name_lower = filename.lower()
    
    if 'v1_lottie' in name_lower or 'lottie_native' in name_lower:
        return "Prototipo inicial basado en Python/Lottie con bridge HTTP para DaVinci Resolve. Predecesor del actual motor DVGE."
    if 'knowledge_bridge' in name_lower:
        return "Documento puente de conocimiento entre versiones del motor. Contiene lecciones aprendidas y arquitectura conceptual."
    if 'audit_engine' in name_lower:
        return "Auditoria tecnica del motor DVGE v5.8. Evalua rendimiento, bugs conocidos y areas de mejora."
    if 'qa_remediation' in name_lower:
        return "Plan de remediacion de calidad para DVGE v4. Lista de bugs priorizados y soluciones implementadas."
    if 'monetization' in name_lower:
        return "Estrategia de monetizacion y modelo de negocio para Ember Motion Studio."
    if 'design_system' in name_lower:
        return "Sistema de diseno UI/UX para el estudio. Principios visuales, paleta de colores, tipografia y componentes."
    if 'implementation_plan' in name_lower:
        return "Plan de implementacion del sistema de plugins. Describe la arquitectura de plugins y su ciclo de vida."
    if 'master_prompt' in name_lower or 'MASTER_PROMPT' in filename:
        return "Prompt maestro del motor DVGE. Contiene las reglas fundamentales del sistema experto para broadcast."
    if 'visual_skills' in name_lower and 'audit' in name_lower:
        return "Auditoria de habilidades visuales del motor. Evalua presets de animacion y gramaticas visuales."
    if 'responsive_protocol' in name_lower:
        return "Protocolo de diseno responsive para plugins DVGE. Define como los graficos se adaptan a diferentes resoluciones."
    if 'next_gen' in name_lower:
        return "Propuestas para la siguiente generacion del motor DVGE. Ideas para v6 y mas alla."
    if 'info.txt' == filename:
        lines = content.strip().split('\n')
        first_lines = [l for l in lines if l.strip() and not l.startswith('#')][:3]
        return "Contexto general del proyecto. " + ' '.join(first_lines)[:200]
    
    # Generic: extract first meaningful paragraph
    lines = content.strip().split('\n')
    meaningful = [l for l in lines if l.strip() and len(l.strip()) > 20 and not l.startswith('#')]
    if meaningful:
        return meaningful[0][:300]
    return "Documento sin descripcion clara."

def scan_files():
    """Scan all files in archives/."""
    files = []
    for root, dirs, filenames in os.walk(ARCHIVES_DIR):
        # Skip hidden directories and the script itself, node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules' and d != '__pycache__']
        if root == ARCHIVES_DIR and 'build_knowledge_db.py' in filenames:
            filenames.remove('build_knowledge_db.py')
        if root == ARCHIVES_DIR and 'knowledge_base.db' in filenames:
            filenames.remove('knowledge_base.db')
        
        for fn in sorted(filenames):
            full_path = os.path.join(root, fn)
            rel_path = os.path.relpath(full_path, PROJECT_ROOT)
            
            # Skip binary files we can't read
            ext = os.path.splitext(fn)[1].lower()
            if ext in ('.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.exe', '.wasm'):
                content = f"[Binary file: {ext}]"
                text_content = False
            else:
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    text_content = True
                except UnicodeDecodeError:
                    try:
                        with open(full_path, 'r', encoding='latin-1') as f:
                            content = f.read()
                        text_content = True
                    except:
                        content = f"[Binary file: {ext}]"
                        text_content = False
            
            files.append({
                'rel_path': rel_path,
                'full_path': full_path,
                'filename': fn,
                'content': content,
                'is_text': text_content,
                'size': os.path.getsize(full_path)
            })
    return files

def create_database():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.executescript('''
        CREATE TABLE IF NOT EXISTS archives (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            original_path   TEXT NOT NULL,
            file_name       TEXT NOT NULL,
            category        TEXT NOT NULL DEFAULT 'uncategorized',
            title           TEXT,
            content         TEXT,
            summary         TEXT,
            reason_created  TEXT,
            reason_obsolete TEXT,
            key_decisions   TEXT,
            valuable_insights TEXT,
            file_size       INTEGER,
            is_text         INTEGER DEFAULT 1,
            status          TEXT DEFAULT 'archived',
            tags            TEXT,
            created_at      TEXT,
            archived_at     TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS git_history (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            archive_id      INTEGER NOT NULL,
            commit_hash     TEXT,
            author          TEXT,
            commit_date     TEXT,
            commit_message  TEXT,
            FOREIGN KEY (archive_id) REFERENCES archives(id)
        );

        CREATE TABLE IF NOT EXISTS tags (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS archive_tags (
            archive_id      INTEGER NOT NULL,
            tag_id          INTEGER NOT NULL,
            PRIMARY KEY (archive_id, tag_id),
            FOREIGN KEY (archive_id) REFERENCES archives(id),
            FOREIGN KEY (tag_id) REFERENCES tags(id)
        );

        CREATE INDEX IF NOT EXISTS idx_archives_category ON archives(category);
        CREATE INDEX IF NOT EXISTS idx_archives_status ON archives(status);
        CREATE INDEX IF NOT EXISTS idx_git_history_archive ON git_history(archive_id);
    ''')
    
    return conn

def infer_reason_created(filename, category):
    """Infer why this file was created based on context."""
    name = filename.lower()
    
    reasons = {
        'audit': 'Evaluar el estado técnico del motor en una versión específica, identificar bugs y áreas de mejora.',
        'architecture': 'Documentar la arquitectura del sistema para orientar el desarrollo y servir como referencia técnica.',
        'plan': 'Planificar el trabajo de desarrollo para un hito o versión específica.',
        'monetization': 'Definir la estrategia comercial y modelo de ingresos del proyecto.',
        'design': 'Establecer principios de diseño y guías visuales para mantener consistencia en la UI.',
        'spec': 'Especificar requerimientos funcionales y técnicos de una funcionalidad o componente.',
        'prototype': 'Explorar un enfoque técnico alternativo (Python/Lottie) antes de adoptar la arquitectura actual.',
        'tool': 'Automatizar tareas de desarrollo, deploy o sincronización.',
        'proposal': 'Proponer ideas para la evolución futura del motor y recopilar feedback.',
        'knowledge': 'Preservar lecciones aprendidas, contexto del proyecto y documentación crítica para la IA.',
        'notes': 'Registrar observaciones, bugs encontrados y notas técnicas durante el desarrollo.',
        'legal': 'Establecer los términos legales de uso, licencia y política de plugins.',
    }
    return reasons.get(category, 'Documentación general del proyecto.')

def infer_reason_obsolete(filename, category):
    """Infer why this file is now obsolete."""
    name = filename.lower()
    
    if 'v1_' in name or 'lottie' in name:
        return 'Prototipo reemplazado por el motor DVGE basado en Remotion/TypeScript. La arquitectura Python/Lottie fue abandonada por limitaciones de rendimiento y determinismo.'
    if 'v56' in name or 'v5.6' in name:
        return 'Documento especifico de la version v5.6. Reemplazado por avances en v5.9 y la nueva arquitectura v6.'
    if 'v4' in name and ('audit' in name or 'plan' in name or 'roadmap' in name):
        return 'Documento de la version v4 del motor. Obsoleto desde la migracion a v5.'
    if 'knowledge_bridge' in name:
        return 'Contenido integrado en la documentacion tecnica actual (TECHNICAL.md, ARC42.md) y en el prompt maestro (MASTER_PROMPT.md).'
    if 'qa_remediation' in name:
        return 'Plan ejecutado y completado. Los bugs documentados fueron corregidos en versiones posteriores.'
    if 'session_audit' in name:
        return 'Auditoria de una sesion de desarrollo especifica. Informacion contextual que no requiere mantenimiento activo.'
    
    obs = {
        'audit': 'Auditoria correspondiente a una version especifica ya superada. El motor ha evolucionado desde entonces.',
        'plan': 'Plan ejecutado o superado por cambios en el roadmap. Las decisiones ya fueron implementadas.',
        'prototype': 'Prototipo abandonado. La arquitectura actual es completamente diferente.',
        'spec': 'Especificacion de una version anterior. Los requerimientos pueden haber cambiado.',
    }
    return obs.get(category, 'Archivo historico preservado por su valor documental. No requiere mantenimiento activo.')

def extract_tags(filename, category, content):
    tags = set()
    tags.add(category)
    
    name = filename.lower()
    if 'dvge' in name or 'dvge' in content[:500].lower():
        tags.add('dvge')
    if 'plugin' in name or 'plugin' in content[:1000].lower():
        tags.add('plugins')
    if 'render' in name or 'render' in content[:1000].lower():
        tags.add('render')
    if 'remotion' in content[:2000].lower():
        tags.add('remotion')
    if 'python' in content[:1000].lower() or 'lottie' in name:
        tags.add('python')
        tags.add('legacy')
    if 'broadcast' in content[:1000].lower():
        tags.add('broadcast')
    if 'electron' in content[:1000].lower():
        tags.add('electron')
    if 'react' in content[:1000].lower():
        tags.add('react')
    if 'api' in name or 'bridge' in name:
        tags.add('api')
    if 'design' in category or 'ui' in content[:1000].lower():
        tags.add('ui-ux')
    if 'monetiz' in content[:1000].lower() or 'pricing' in content[:1000].lower():
        tags.add('business')
    if 'security' in content[:1000].lower() or 'legal' in category:
        tags.add('legal')
    
    return sorted(tags)

def main():
    print("Escaneando archivos en archives/ ...")
    files = scan_files()
    print(f"  -> {len(files)} archivos encontrados")
    
    print("Creando base de datos SQLite ...")
    conn = create_database()
    c = conn.cursor()
    
    print("Insertando archivos con analisis ...")
    inserted = 0
    
    # Clear existing data
    c.execute("DELETE FROM archive_tags")
    c.execute("DELETE FROM git_history")
    c.execute("DELETE FROM archives")
    c.execute("DELETE FROM tags")
    
    for f in files:
        category = classify_file(f['rel_path'])
        decisions, insights = extract_valuable_content(f['content'], f['filename'])
        summary = generate_summary(f['content'], f['filename'])
        reason_created = infer_reason_created(f['filename'], category)
        reason_obsolete = infer_reason_obsolete(f['filename'], category)
        tags = extract_tags(f['filename'], category, f['content'])
        
        # Get git history
        git_log = get_git_log(f['rel_path'])
        first_commit = git_log[-1] if git_log else {}
        created_at = first_commit.get('date', 'unknown')
        
        c.execute('''
            INSERT INTO archives 
            (original_path, file_name, category, title, content, summary, 
             reason_created, reason_obsolete, key_decisions, valuable_insights,
             file_size, is_text, status, tags, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            f['rel_path'],
            f['filename'],
            category,
            os.path.splitext(f['filename'])[0],
            f['content'],
            summary,
            reason_created,
            reason_obsolete,
            '\n---\n'.join(decisions[:10]) if decisions else None,
            '\n---\n'.join(insights[:10]) if insights else None,
            f['size'],
            1 if f['is_text'] else 0,
            'archived',
            ','.join(tags),
            created_at
        ))
        
        archive_id = c.lastrowid
        
        # Insert git history
        for commit in git_log:
            c.execute('''
                INSERT INTO git_history (archive_id, commit_hash, author, commit_date, commit_message)
                VALUES (?, ?, ?, ?, ?)
            ''', (archive_id, commit['hash'], commit['author'], commit['date'], commit['message']))
        
        # Insert tags
        for tag_name in tags:
            c.execute("INSERT OR IGNORE INTO tags (name) VALUES (?)", (tag_name,))
            c.execute("SELECT id FROM tags WHERE name = ?", (tag_name,))
            tag_id = c.fetchone()[0]
            c.execute("INSERT OR IGNORE INTO archive_tags (archive_id, tag_id) VALUES (?, ?)", (archive_id, tag_id))
        
        inserted += 1
        if inserted % 10 == 0:
            print(f"   ... {inserted}/{len(files)}")
    
    conn.commit()
    
    # Show summary
    print(f"\nBase de datos creada: {DB_PATH}")
    print(f"  Archivos archivados: {inserted}")
    print(f"  Commits de git registrados: {c.execute('SELECT COUNT(*) FROM git_history').fetchone()[0]}")
    print(f"  Tags unicos: {c.execute('SELECT COUNT(*) FROM tags').fetchone()[0]}")
    print(f"\nArchivos por categoria:")
    for row in c.execute('SELECT category, COUNT(*) FROM archives GROUP BY category ORDER BY COUNT(*) DESC'):
        print(f"  {row[0]:20s}: {row[1]}")
    
    print(f"\nTamano de la DB: {os.path.getsize(DB_PATH) / 1024:.1f} KB")
    conn.close()

if __name__ == '__main__':
    main()
