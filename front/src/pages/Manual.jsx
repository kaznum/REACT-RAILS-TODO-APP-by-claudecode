import { Link } from 'react-router-dom'
import '../styles/Manual.scss'

function Manual() {
  return (
    <div className="manual-container">
      <div className="manual-header">
        <h1>TODO管理アプリ 使い方マニュアル</h1>
        <Link to="/todos" className="back-button">TODOリストに戻る</Link>
      </div>

      <div className="manual-content">
        <section className="manual-section">
          <h2>📝 はじめに</h2>
          <p>このアプリは、Google認証を使った安全なTODO管理アプリケーションです。タスクの追加、編集、削除、完了管理が簡単に行えます。</p>
        </section>

        <section className="manual-section">
          <h2>🔐 ログイン</h2>
          <ol>
            <li>ログインページで「Googleでログイン」ボタンをクリック</li>
            <li>Googleアカウントを選択して認証</li>
            <li>認証が完了すると自動的にTODOリストページに移動します</li>
          </ol>
          <p className="note">※ 初回ログイン時は、アプリへのアクセス許可が求められます。</p>
        </section>

        <section className="manual-section">
          <h2>➕ TODOの追加</h2>
          <ol>
            <li>ページ上部のフォームに「TODO名」を入力（必須・最大255文字）</li>
            <li>必要に応じて「期限」を設定（任意）</li>
            <li>「優先度」を選択（高・中・低から選択、デフォルトは中）</li>
            <li>「追加」ボタンをクリック</li>
          </ol>
          <p className="note">※ 優先度は高＞中＞低の順で表示されます。同じ優先度の場合、期限なしが最初に表示されます。</p>
        </section>

        <section className="manual-section">
          <h2>✏️ TODOの編集</h2>
          <ol>
            <li>編集したいTODOの「編集」ボタンをクリック</li>
            <li>入力フォームが表示されるので、TODO名、期限、優先度を変更</li>
            <li>「保存」ボタンをクリックして保存</li>
            <li>編集をやめる場合は「キャンセル」ボタンをクリック</li>
          </ol>
        </section>

        <section className="manual-section">
          <h2>🎯 優先度の設定</h2>
          <p>各TODOには優先度を設定できます：</p>
          <ul>
            <li><strong>高</strong>: 緊急で重要なタスク（赤色で表示）</li>
            <li><strong>中</strong>: 通常のタスク（黄色で表示、デフォルト）</li>
            <li><strong>低</strong>: 余裕があるときに行うタスク（緑色で表示）</li>
          </ul>
          <p className="note">※ TODOは優先度が高い順に表示されます。色分けされた左ボーダーとバッジで視覚的に確認できます。</p>
        </section>

        <section className="manual-section">
          <h2>✅ TODOの完了・未完了の切り替え</h2>
          <ol>
            <li>各TODOの左側にあるチェックボックスをクリック</li>
            <li>チェックを入れると完了状態になり、グレーアウト表示されます</li>
            <li>もう一度クリックすると未完了状態に戻ります</li>
          </ol>
        </section>

        <section className="manual-section">
          <h2>🗑️ TODOの削除</h2>
          <ol>
            <li>削除したいTODOの「削除」ボタンをクリック</li>
            <li>確認ダイアログが表示されるので「OK」をクリック</li>
          </ol>
          <p className="note warning">⚠️ 削除したTODOは復元できませんのでご注意ください。</p>
        </section>

        <section className="manual-section">
          <h2>📋 TODOの表示順序</h2>
          <p>TODOは以下の順序で表示されます：</p>
          <ol>
            <li>優先度の高い順（高→中→低）</li>
            <li>同じ優先度内では：
              <ul>
                <li>期限なしのTODO（作成順）</li>
                <li>期限ありのTODO（期限が早い順）</li>
              </ul>
            </li>
          </ol>
          <p className="note">※ 期限の表示について：</p>
          <ul>
            <li>本日締め切り: オレンジ色の太字で「本日締め切り (日付)」と表示</li>
            <li>期限切れ（未完了）: 赤色の太字で表示</li>
            <li>完了済み: 通常の色で表示</li>
          </ul>
        </section>

        <section className="manual-section">
          <h2>🚪 ログアウト</h2>
          <ol>
            <li>画面右上のユーザー名の横にある「ログアウト」ボタンをクリック</li>
            <li>ログインページに戻ります</li>
          </ol>
        </section>

        <section className="manual-section">
          <h2>💡 ヒント</h2>
          <ul>
            <li>TODO名は必須項目です。入力しないと追加できません</li>
            <li>TODO名は最大255文字まで入力できます</li>
            <li>期限は任意項目です。設定しなくても問題ありません</li>
            <li>優先度のデフォルトは「中」です</li>
            <li>優先度は色分けされて表示されるので、一目で重要度がわかります</li>
            <li>完了したTODOもそのまま一覧に残ります</li>
            <li>不要になったTODOは削除ボタンで削除できます</li>
          </ul>
        </section>

        <section className="manual-section">
          <h2>❓ トラブルシューティング</h2>
          <div className="troubleshooting">
            <h3>ログインできない場合</h3>
            <ul>
              <li>ブラウザのCookieとJavaScriptが有効になっているか確認してください</li>
              <li>別のブラウザで試してみてください</li>
            </ul>

            <h3>TODOが追加できない場合</h3>
            <ul>
              <li>TODO名を入力しているか確認してください</li>
              <li>TODO名が255文字を超えていないか確認してください</li>
              <li>ネットワーク接続を確認してください</li>
            </ul>

            <h3>セッションが切れた場合</h3>
            <ul>
              <li>自動的にログインページにリダイレクトされます</li>
              <li>再度ログインしてください</li>
            </ul>
          </div>
        </section>

        <section className="manual-section">
          <h2>🔒 セキュリティについて</h2>
          <p>このアプリでは、以下のセキュリティ対策を実施しています：</p>
          <ul>
            <li>Google OAuth 2.0による安全な認証</li>
            <li>JWT（JSON Web Token）によるステートレス認証</li>
            <li>トークンの有効期限は24時間</li>
            <li>ユーザーごとにTODOデータが分離されています</li>
          </ul>
        </section>
      </div>

      <div className="manual-footer">
        <Link to="/todos" className="back-button-bottom">TODOリストに戻る</Link>
      </div>
    </div>
  )
}

export default Manual
