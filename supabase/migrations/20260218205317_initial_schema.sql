drop extension if exists "pg_net";


  create table "public"."admins" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "password_hash" text not null,
    "nome" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."admins" enable row level security;


  create table "public"."pedidos" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "cliente_nome" text not null,
    "cliente_whatsapp" text not null,
    "endereco_rua" text not null,
    "endereco_numero" text not null,
    "endereco_bairro" text not null,
    "endereco_complemento" text,
    "itens_json" jsonb not null,
    "valor_total" numeric(10,2) not null,
    "status_pagamento" text default 'pendente'::text,
    "mercado_pago_id" text,
    "external_reference" uuid default gen_random_uuid()
      );


alter table "public"."pedidos" enable row level security;


  create table "public"."produtos" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "descricao" text not null default ''::text,
    "preco" numeric(10,2) not null,
    "categoria" text not null,
    "destaque" boolean not null default false,
    "imagem" text not null default ''::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "ingredientes" text
      );


alter table "public"."produtos" enable row level security;

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);

CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (id);

CREATE INDEX idx_produtos_categoria ON public.produtos USING btree (categoria);

CREATE INDEX idx_produtos_destaque ON public.produtos USING btree (destaque) WHERE (destaque = true);

CREATE UNIQUE INDEX pedidos_mercado_pago_id_key ON public.pedidos USING btree (mercado_pago_id);

CREATE UNIQUE INDEX pedidos_pkey ON public.pedidos USING btree (id);

CREATE UNIQUE INDEX produtos_pkey ON public.produtos USING btree (id);

alter table "public"."admins" add constraint "admins_pkey" PRIMARY KEY using index "admins_pkey";

alter table "public"."pedidos" add constraint "pedidos_pkey" PRIMARY KEY using index "pedidos_pkey";

alter table "public"."produtos" add constraint "produtos_pkey" PRIMARY KEY using index "produtos_pkey";

alter table "public"."admins" add constraint "admins_email_key" UNIQUE using index "admins_email_key";

alter table "public"."pedidos" add constraint "pedidos_mercado_pago_id_key" UNIQUE using index "pedidos_mercado_pago_id_key";

alter table "public"."produtos" add constraint "produtos_preco_check" CHECK ((preco > (0)::numeric)) not valid;

alter table "public"."produtos" validate constraint "produtos_preco_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_external_reference_from_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.external_reference := NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."admins" to "anon";

grant insert on table "public"."admins" to "anon";

grant references on table "public"."admins" to "anon";

grant select on table "public"."admins" to "anon";

grant trigger on table "public"."admins" to "anon";

grant truncate on table "public"."admins" to "anon";

grant update on table "public"."admins" to "anon";

grant delete on table "public"."admins" to "authenticated";

grant insert on table "public"."admins" to "authenticated";

grant references on table "public"."admins" to "authenticated";

grant select on table "public"."admins" to "authenticated";

grant trigger on table "public"."admins" to "authenticated";

grant truncate on table "public"."admins" to "authenticated";

grant update on table "public"."admins" to "authenticated";

grant delete on table "public"."admins" to "service_role";

grant insert on table "public"."admins" to "service_role";

grant references on table "public"."admins" to "service_role";

grant select on table "public"."admins" to "service_role";

grant trigger on table "public"."admins" to "service_role";

grant truncate on table "public"."admins" to "service_role";

grant update on table "public"."admins" to "service_role";

grant delete on table "public"."pedidos" to "anon";

grant insert on table "public"."pedidos" to "anon";

grant references on table "public"."pedidos" to "anon";

grant select on table "public"."pedidos" to "anon";

grant trigger on table "public"."pedidos" to "anon";

grant truncate on table "public"."pedidos" to "anon";

grant update on table "public"."pedidos" to "anon";

grant delete on table "public"."pedidos" to "authenticated";

grant insert on table "public"."pedidos" to "authenticated";

grant references on table "public"."pedidos" to "authenticated";

grant select on table "public"."pedidos" to "authenticated";

grant trigger on table "public"."pedidos" to "authenticated";

grant truncate on table "public"."pedidos" to "authenticated";

grant update on table "public"."pedidos" to "authenticated";

grant delete on table "public"."pedidos" to "service_role";

grant insert on table "public"."pedidos" to "service_role";

grant references on table "public"."pedidos" to "service_role";

grant select on table "public"."pedidos" to "service_role";

grant trigger on table "public"."pedidos" to "service_role";

grant truncate on table "public"."pedidos" to "service_role";

grant update on table "public"."pedidos" to "service_role";

grant delete on table "public"."produtos" to "anon";

grant insert on table "public"."produtos" to "anon";

grant references on table "public"."produtos" to "anon";

grant select on table "public"."produtos" to "anon";

grant trigger on table "public"."produtos" to "anon";

grant truncate on table "public"."produtos" to "anon";

grant update on table "public"."produtos" to "anon";

grant delete on table "public"."produtos" to "authenticated";

grant insert on table "public"."produtos" to "authenticated";

grant references on table "public"."produtos" to "authenticated";

grant select on table "public"."produtos" to "authenticated";

grant trigger on table "public"."produtos" to "authenticated";

grant truncate on table "public"."produtos" to "authenticated";

grant update on table "public"."produtos" to "authenticated";

grant delete on table "public"."produtos" to "service_role";

grant insert on table "public"."produtos" to "service_role";

grant references on table "public"."produtos" to "service_role";

grant select on table "public"."produtos" to "service_role";

grant trigger on table "public"."produtos" to "service_role";

grant truncate on table "public"."produtos" to "service_role";

grant update on table "public"."produtos" to "service_role";


  create policy "Produtos são públicos para leitura"
  on "public"."produtos"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER pedidos_set_external_reference BEFORE INSERT ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.set_external_reference_from_id();

CREATE TRIGGER produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


