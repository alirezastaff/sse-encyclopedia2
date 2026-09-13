<?php get_header(); ?><header class="sse-hero"><h1><?php post_type_archive_title(); ?></h1><p><?php esc_html_e( 'Browse the encyclopedia articles.', 'sse-encyclopedia' ); ?></p></header>
<section class="sse-grid">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?><article class="sse-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article><?php endwhile; else : ?><p><?php esc_html_e( 'No articles found.', 'sse-encyclopedia' ); ?></p><?php endif; ?>
</section><?php get_footer(); ?>
