<?php get_header(); while ( have_posts() ) : the_post(); $article_id = get_the_ID(); ?>
<article <?php post_class(); ?> data-sse-article="<?php echo esc_attr( $article_id ); ?>" data-sse-group="<?php echo esc_attr( get_post_meta( $article_id, '_sse_translation_group_id', true ) ?: $article_id ); ?>">
<header class="sse-article-header"><h1><?php the_title(); ?></h1><div class="sse-article-meta"><?php echo esc_html( get_post_meta( $article_id, '_sse_author_text', true ) ); ?></div></header>
<div class="sse-controls" data-sse-controls>
<button class="sse-button" type="button" data-sse-action="bookmark"><?php esc_html_e( 'Bookmark', 'sse-encyclopedia' ); ?></button>
<button class="sse-button" type="button" data-sse-action="reading-list"><?php esc_html_e( 'Reading list', 'sse-encyclopedia' ); ?></button>
<button class="sse-button" type="button" data-sse-action="reading-status" data-sse-status="to-read"><?php esc_html_e( 'To read', 'sse-encyclopedia' ); ?></button>
<button class="sse-button" type="button" data-sse-action="reading-status" data-sse-status="reading"><?php esc_html_e( 'Reading', 'sse-encyclopedia' ); ?></button>
<button class="sse-button" type="button" data-sse-action="reading-status" data-sse-status="completed"><?php esc_html_e( 'Completed', 'sse-encyclopedia' ); ?></button>
<button class="sse-button" type="button" data-sse-action="dark-mode"><?php esc_html_e( 'Dark mode', 'sse-encyclopedia' ); ?></button>
</div>
<div class="sse-progress" aria-label="<?php esc_attr_e( 'Reading progress', 'sse-encyclopedia' ); ?>"><span data-sse-progress></span></div>
<p class="sse-notice" data-sse-notice aria-live="polite"></p>
<div class="sse-article-content" data-sse-content><?php the_content(); ?></div>
<section class="sse-private-note sse-card" aria-labelledby="sse-private-note-title">
<h2 id="sse-private-note-title"><?php esc_html_e( 'Private note', 'sse-encyclopedia' ); ?></h2>
<textarea data-sse-private-note rows="5" placeholder="<?php esc_attr_e( 'Write a private note about this article.', 'sse-encyclopedia' ); ?>"></textarea>
<button class="sse-button" type="button" data-sse-action="private-note"><?php esc_html_e( 'Save private note', 'sse-encyclopedia' ); ?></button>
</section>
<?php comments_template(); ?>
</article>
<?php endwhile; get_footer(); ?>
