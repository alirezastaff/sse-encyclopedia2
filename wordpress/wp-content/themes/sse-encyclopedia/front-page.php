<?php
get_header();
$locale = function_exists( 'pll_current_language' ) && 'fa' === pll_current_language() ? 'fa' : 'en';
$content = function_exists( 'sse_homepage_content' ) ? sse_homepage_content()[ $locale ] : array();
$archive = get_post_type_archive_link( 'sse_article' );
$actions = array_values( array_filter( (array) ( $content['heroActions'] ?? array() ), static function ( $item ) { return ! empty( $item['enabled'] ); } ) );
$features = array_values( array_filter( (array) ( $content['features'] ?? array() ), static function ( $item ) { return ! empty( $item['enabled'] ); } ) );
?>
<section class="sse-hero">
<p class="sse-kicker"><?php echo esc_html( $content['eyebrow'] ?? get_bloginfo( 'description' ) ); ?></p>
<h1><?php echo esc_html( $content['heroTitle'] ?? get_bloginfo( 'name' ) ); ?><br><span><?php echo esc_html( $content['heroTitleAccent'] ?? '' ); ?></span></h1>
<p><?php echo esc_html( $content['heroDescription'] ?? get_bloginfo( 'description' ) ); ?></p>
<?php if ( $actions ) : ?><div class="sse-actions"><?php foreach ( $actions as $index => $action ) : ?><a class="sse-button<?php echo 0 === $index ? ' is-primary' : ''; ?>" href="<?php echo esc_url( $action['href'] ?? $archive ); ?>"><?php echo esc_html( $action['label'] ?? '' ); ?></a><?php endforeach; ?></div><?php endif; ?>
</section>
<?php if ( $content ) : ?><section class="sse-home-section" id="project"><div class="sse-section-heading"><p class="sse-kicker"><?php echo esc_html( $content['sourceLabel'] ?? '' ); ?></p><p><?php echo esc_html( $content['sourceText'] ?? '' ); ?></p></div>
<?php if ( ! empty( $content['infoItems'] ) ) : ?><div class="sse-info-grid"><?php foreach ( array_filter( $content['infoItems'], static function ( $item ) { return ! empty( $item['enabled'] ); } ) as $item ) : ?><div class="sse-info-item"><strong><?php echo esc_html( $item['number'] ?? '' ); ?></strong><span><?php echo esc_html( $item['text'] ?? '' ); ?></span></div><?php endforeach; ?></div><?php endif; ?>
<div class="sse-home-copy"><h2><?php echo esc_html( $content['introTitle'] ?? '' ); ?></h2><p><?php echo esc_html( $content['introText'] ?? '' ); ?></p></div></section>
<?php if ( $features ) : ?><section class="sse-home-section"><h2><?php echo 'fa' === $locale ? 'امکانات دانشنامه' : 'Explore the encyclopedia'; ?></h2><div class="sse-grid"><?php foreach ( $features as $feature ) : ?><article class="sse-card"><div class="sse-feature-icon"><?php echo esc_html( $feature['icon'] ?? '' ); ?></div><h3><?php echo esc_html( $feature['title'] ?? '' ); ?></h3><p><?php echo esc_html( $feature['text'] ?? '' ); ?></p><a href="<?php echo esc_url( $feature['href'] ?? '#' ); ?>"><?php echo 'fa' === $locale ? 'مشاهده' : 'Explore'; ?> →</a></article><?php endforeach; ?></div></section><?php endif; ?>
<?php endif; ?>
<section class="sse-home-section"><div class="sse-section-heading"><h2><?php echo 'fa' === $locale ? 'آخرین مدخل‌ها' : 'Latest entries'; ?></h2><a href="<?php echo esc_url( $archive ); ?>"><?php echo 'fa' === $locale ? 'مشاهده آرشیو' : 'Browse archive'; ?> →</a></div><div class="sse-grid">
<?php $articles = new WP_Query( array( 'post_type' => 'sse_article', 'posts_per_page' => 6, 'post_status' => 'publish', 'no_found_rows' => true ) ); ?>
<?php while ( $articles->have_posts() ) : $articles->the_post(); ?><article class="sse-card"><h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><?php the_excerpt(); ?></article><?php endwhile; wp_reset_postdata(); ?>
</div></section>
<?php get_footer(); ?>
