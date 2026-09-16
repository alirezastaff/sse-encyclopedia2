<?php
/* Template Name: SSE Case Studies */
get_header();
$locale = function_exists( 'pll_current_language' ) && 'fa' === pll_current_language() ? 'fa' : 'en';
$studies = sse_encyclopedia_get_case_studies( new WP_REST_Request( 'GET', '/sse/v1/case-studies' ) );
$studies = is_wp_error( $studies ) ? array() : $studies->get_data();
?>
<section class="sse-hero">
<h1><?php echo 'fa' === $locale ? 'مطالعات موردی' : 'Case Studies'; ?></h1>
<p><?php echo 'fa' === $locale ? 'نمونه‌هایی از تجربه‌های عملی اقتصاد اجتماعی و همبستگی.' : 'Practical examples from the social and solidarity economy.'; ?></p>
</section>
<section class="sse-grid">
<?php if ( $studies ) : foreach ( $studies as $study ) : ?>
<article class="sse-card">
<?php if ( ! empty( $study['category'] ) ) : ?><span class="sse-label"><?php echo esc_html( $study['category'] ); ?></span><?php endif; ?>
<h2><?php echo esc_html( $study['title'] ); ?></h2>
<?php if ( ! empty( $study['place'] ) || ! empty( $study['type'] ) ) : ?><p class="sse-muted"><?php echo esc_html( trim( $study['place'] . ' · ' . $study['type'], ' ·' ) ); ?></p><?php endif; ?>
<p><?php echo esc_html( $study['summary'] ); ?></p>
<?php if ( ! empty( $study['metric'] ) ) : ?><p><strong><?php echo esc_html( $study['metric'] ); ?></strong></p><?php endif; ?>
<?php if ( ! empty( $study['pdfUrl'] ) ) : ?><a class="sse-button" href="<?php echo esc_url( $study['pdfUrl'] ); ?>" target="_blank" rel="noopener"><?php echo 'fa' === $locale ? 'دانلود PDF' : 'Download PDF'; ?></a><?php endif; ?>
</article>
<?php endforeach; else : ?><p><?php echo 'fa' === $locale ? 'هنوز مطالعه موردی منتشر نشده است.' : 'No case studies have been published yet.'; ?></p><?php endif; ?>
</section>
<?php get_footer();
