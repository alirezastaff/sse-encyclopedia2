<?php get_header(); ?>
<section class="sse-hero">
<h1><?php bloginfo( 'name' ); ?></h1>
<p><?php bloginfo( 'description' ); ?></p>
</section>
<section class="sse-grid" aria-label="<?php esc_attr_e( 'Featured articles', 'sse-encyclopedia' ); ?>">
<?php $articles = new WP_Query( array( 'post_type' => 'sse_article', 'posts_per_page' => 6, 'post_status' => 'publish' ) ); ?>
<?php while ( $articles->have_posts() ) : $articles->the_post(); ?>
<article class="sse-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>
<?php endwhile; wp_reset_postdata(); ?>
</section>
<?php get_footer(); ?>
