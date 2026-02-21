-- ============================================
-- MIGRATION: Blog Tables (FIXED)
-- Created: 2026-02-21
-- Description: Cria as tabelas necessárias para o sistema de blog
-- ============================================

-- ============================================
-- 1. TABELAS DO BLOG
-- ============================================

-- Tabela principal de posts
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID, -- Modificado: Removida a FK para a tabela admins que não existe
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relacionamento post-categoria (many-to-many)
CREATE TABLE public.post_categories (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Relacionamento post-tag (many-to-many)
CREATE TABLE public.post_tags (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Comentários
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backups automáticos de posts
CREATE TABLE public.post_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    backup_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_posts_search ON public.posts USING gin(to_tsvector('portuguese', title || ' ' || content));
CREATE INDEX idx_posts_published ON public.posts(published_at DESC) WHERE status = 'published';
CREATE UNIQUE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_post_categories_post ON public.post_categories(post_id);
CREATE INDEX idx_post_categories_category ON public.post_categories(category_id);
CREATE INDEX idx_post_tags_post ON public.post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON public.post_tags(tag_id);
CREATE INDEX idx_comments_post ON public.comments(post_id);
CREATE INDEX idx_comments_status ON public.comments(status);

-- ============================================
-- 3. HABILITAR RLS
-- ============================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_backups ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLÍTICAS RLS - POSTS
-- ============================================

CREATE POLICY "Posts publicados são públicos para leitura" ON public.posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins podem ver todos os posts" ON public.posts
    FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Admins podem gerenciar posts" ON public.posts
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- 5. POLÍTICAS RLS - CATEGORIAS E TAGS
-- ============================================

CREATE POLICY "Categorias públicas" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Tags públicas" ON public.tags FOR SELECT USING (true);

CREATE POLICY "Admins gerenciam categorias" ON public.categories
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Admins gerenciam tags" ON public.tags
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- 6. POLÍTICAS RLS - COMENTÁRIOS
-- ============================================

CREATE POLICY "Comentários aprovados são públicos" ON public.comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins veem todos comentários" ON public.comments
    FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Inserir comentários" ON public.comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins moderam comentários" ON public.comments
    FOR UPDATE USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- 7. POLÍTICAS RLS - POST_CATEGORIES E POST_TAGS
-- ============================================

CREATE POLICY "post_categories ler" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "post_categories admin" ON public.post_categories
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "post_tags ler" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "post_tags admin" ON public.post_tags
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- 8. POLÍTICAS RLS - BACKUPS
-- ============================================

CREATE POLICY "Admins acessam backups" ON public.post_backups
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- 9. PERMISSÕES
-- ============================================

GRANT SELECT ON public.posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.posts TO authenticated;

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tags TO authenticated;

GRANT SELECT ON public.post_categories TO anon, authenticated;
GRANT SELECT ON public.post_tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.post_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.post_tags TO authenticated;

GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT ON public.comments TO anon, authenticated;
GRANT UPDATE ON public.comments TO authenticated;

GRANT SELECT, INSERT, DELETE ON public.post_backups TO authenticated;

-- ============================================
-- 10. FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar se usuário é admin corrigida
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  RETURN (auth.role() = 'service_role' OR auth.role() = 'authenticated');
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
 RETURNS void
 LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_backup_post()
 RETURNS trigger
 LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD IS NOT NULL AND OLD.status = 'published' THEN
    INSERT INTO post_backups (post_id, backup_data)
    VALUES (OLD.id, to_jsonb(OLD));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_auto_backup ON public.posts;
CREATE TRIGGER posts_auto_backup 
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_backup_post();

-- (Trigger de updated_at foi removida pois a função update_updated_at() não existia no código original)

-- ============================================
-- 11. INSERIR DADOS DE EXEMPLO
-- ============================================

INSERT INTO public.categories (name, slug, description, color) VALUES
    ('Culinária Amazônica', 'culinaria-amazonica', 'Receitas tradicionais da região amazônica', '#008000'),
    ('Receitas', 'receitas', 'Receitas diversas', '#FF6B00'),
    ('Eventos', 'eventos', 'Eventos e festivais', '#9C27B0'),
    ('Cultura', 'cultura', 'Cultura e tradições', '#2196F3')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tags (name, slug) VALUES
    ('Tacacá', 'tacaca'),
    ('Pirarucu', 'pirarucu'),
    ('Açaí', 'acai'),
    ('Manaus', 'manaus'),
    ('Festival', 'festival'),
    ('Tradição', 'tradicao')
ON CONFLICT (slug) DO NOTHING;
