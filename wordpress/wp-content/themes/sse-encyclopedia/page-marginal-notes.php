<?php
/* Template Name: SSE Marginal Notes */
get_header();
$locale = function_exists( 'pll_current_language' ) && 'fa' === pll_current_language() ? 'fa' : 'en';
$notes = get_comments( array( 'type' => 'sse_public_note', 'status' => 'approve', 'number' => 30, 'orderby' => 'comment_date_gmt', 'order' => 'DESC' ) );
?>
<section class="sse-hero">
<h1><?php echo 'fa' === $locale ? 'حاشیه نگار' : 'Marginal Notes'; ?></h1>
<p><?php echo 'fa' === $locale ? 'فضایی برای پژوهشگران و علاقمندان تا ایده‌های خود را به مدخل‌های پژوهشی پیوند بزنند و گفت‌وگو پیرامون مسائل کلیدی را توسعه دهند.' : 'A research space for connecting ideas to encyclopedia entries and extending focused discussion.'; ?></p>
</section>
<section class="sse-card sse-note-feed" aria-labelledby="sse-note-feed-title">
<h2 id="sse-note-feed-title"><?php echo 'fa' === $locale ? 'آخرین حاشیه‌ها' : 'Latest notes'; ?></h2>
<?php if ( $notes ) : ?><div class="sse-note-list"><?php foreach ( $notes as $note ) : ?>
<article class="sse-note-item"><header><strong><?php echo esc_html( $note->comment_author ); ?></strong><time datetime="<?php echo esc_attr( get_comment_time( 'c', true, false, $note ) ); ?>"><?php echo esc_html( get_comment_date( '', $note ) ); ?></time></header><p><?php echo esc_html( $note->comment_content ); ?></p><a href="<?php echo esc_url( get_permalink( $note->comment_post_ID ) . '#comment-' . $note->comment_ID ); ?>"><?php echo 'fa' === $locale ? 'مشاهده مدخل مرتبط' : 'View related entry'; ?></a></article>
<?php endforeach; ?></div><?php else : ?><p><?php echo 'fa' === $locale ? 'هنوز حاشیه‌ای منتشر نشده است.' : 'No public notes have been published yet.'; ?></p><?php endif; ?>
</section>
<?php get_footer();
